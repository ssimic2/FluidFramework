/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";

import { TaskManager } from "@fluid-experimental/task-manager";
import { ConsensusRegisterCollection } from "@fluidframework/register-collection";
import { IFluidContainer, SharedMap } from "fluid-framework";

import {
    IAzureAudience,
    AzureFunctionTokenProvider,
    AzureClient,
    AzureConnectionConfig,
    // LOCAL_MODE_TENANT_ID,
} from "@fluidframework/azure-client";
import {
    generateTestUser,
    InsecureTokenProvider,
} from "@fluidframework/test-client-utils";

const markedForRecoveryKey = "marked";
const recoveredKey = "recovered";

const useAzure = process.env.FLUID_CLIENT === "azure";

const user = generateTestUser();

const userConfig = {
    id: user.id,
    name: user.name,
};

const connectionConfig: AzureConnectionConfig = useAzure
    ? {
          tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
          tokenProvider: new AzureFunctionTokenProvider(
              "https://ssazuretokengen.azurewebsites.net/api/GetFrsToken",
              {
                  userId: "test-user",
                  userName: "Test User",
              }
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      }
    : {
          tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
          tokenProvider: new InsecureTokenProvider(
              "5f9d1943796b6d248041950aa2c1d7dc",
              userConfig
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      };

// Define the schema of our Container.
const containerSchema = {
    initialObjects: {
        crc: ConsensusRegisterCollection,
        taskManager: TaskManager,
        containerInfo: SharedMap,
    },
};

const recoveryTaskName = "recoverTask";

export type RecoveryStatus = "NotStarted" | "KickedOff" | "Completed";

export interface RollbackStatus {
    originalContainerId: string;
    isContainerCorrupted: boolean;
    recoveredContainerId: string;
    recoveryStatus: RecoveryStatus;
    recoveryLog: string;
    recoveredBy: string;
    isContainerRecovered: boolean;
}

// export interface ITimestampController extends EventEmitter {
//     on(event: "timeChanged", listener: () => void): this;
// }

export class RollbackAgent extends EventEmitter {
    private readonly _crc: ConsensusRegisterCollection<boolean>;
    private readonly _taskManager: TaskManager;
    private readonly _containerInfo: SharedMap;
    private _recoveryLog: string;

    /**
     * Creates a new client instance using configuration parameters.
     * @param props - Properties for initializing a new AzureClient instance
     */
    constructor(private readonly recoveryContainer: IFluidContainer, private readonly audience: IAzureAudience) {
        super();

        this._containerInfo = this.recoveryContainer.initialObjects.containerInfo as SharedMap;
        this._containerInfo.on("valueChanged", () => {
            this.emit("rollbackInfoChanged");
        });

        this._crc = this.recoveryContainer.initialObjects.crc as ConsensusRegisterCollection<boolean>;
        this._taskManager = this.recoveryContainer.initialObjects.taskManager as TaskManager;

        this._recoveryLog = "";
    }

    /**
     * Creates a new detached container instance in the Azure Fluid Relay.
     * @param containerSchema - Container schema for the new container.
     * @returns New detached container instance along with associated services.
     */
    public static async createRecoveryContainer(
        containerId: string
    ): Promise<string> {
        const clientProps = {
            connection: connectionConfig,
        };
        const client = new AzureClient(clientProps);

        // The client will create a new detached container using the schema
        // A detached container will enable the app to modify the container before attaching it to the client
        const c = await client.createContainer(containerSchema);

        const containerInfo = c.container.initialObjects
            .containerInfo as SharedMap;
        const crc = c.container.initialObjects
            .crc as ConsensusRegisterCollection<boolean>;

        await Promise.all([
            containerInfo.set("corrupted", false),
            containerInfo.set("originalContainerId", containerId),
            containerInfo.set("recoveredContainerId", ""),
            containerInfo.set("recoveryStatus", "NotStarted"),
            containerInfo.set("recoveredBy", ""),
            crc.write(markedForRecoveryKey, false),
            crc.write(recoveredKey, false),
        ]);

        // If the app is in a `createNew` state, and the container is detached, we attach the container.
        // This uploads the container to the service and connects to the collaboration session.
        const id = await c.container.attach();
        return id;
    }

    public static async loadFromRecoveryContainer(
        containerId: string
    ): Promise<RollbackAgent> {
        const clientProps = {
            connection: connectionConfig,
        };
        const client = new AzureClient(clientProps);
        const c = await client.getContainer(containerId, containerSchema);

        return new RollbackAgent(c.container, c.services.audience);
    }

    public markCorrupted(): void {
        this._containerInfo.set("corrupted", true);
    }

    public get getRecoveryStatus(): RollbackStatus {
        return {
            originalContainerId: this._containerInfo.get(
                "originalContainerId",
            ) as string,
            isContainerCorrupted: this._containerInfo.get("corrupted") as boolean,
            recoveryStatus: this._containerInfo.get(
                "recoveryStatus",
            ) as RecoveryStatus,
            isContainerRecovered: this.recovered,
            recoveryLog: this._recoveryLog,
            recoveredContainerId: this._containerInfo.get(
                "recoveredContainerId",
            ) as string,
            recoveredBy: this._containerInfo.get(
                "recoveryUserId",
            ) as string,
        };
    }

    /* Recovery */

    public async recoverDoc(): Promise<void> {
        this.log("Kicked off recovery.");

        if (!this.markedForRecovery) {
            this.log("Marked for forecovery.");
            await this.markForRecovery();
        }

        if (this.recovered) {
            this.log("Doc already recovered!");
            return;
        }

        await this.volunteerForRecovery();
        if (this.recovered) {
            this.log( "We volonteered, but doc already recovered!");
            return;
        }

        this.recoverySuccess();

        if (!this.haveRecoveryTask()) {
            this.log("Error during recovery.");
            throw new Error("Lost task during write");
        } else {
            await this.setRecovered();
            this.log("This client recovered container.");
        }
    }

    private async volunteerForRecovery(): Promise<void> {
        return this._taskManager.lockTask(recoveryTaskName);
    }

    private haveRecoveryTask(): boolean {
        return this._taskManager.haveTaskLock(recoveryTaskName) ?? false;
    }

    private get recovered() {
        return this._crc.read(recoveredKey) as boolean;
    }

    private async setRecovered() {
        // Using a consensus-type data structure here, to make it easier to validate
        // that the setRecovered was ack'd and we can have confidence other clients will agree.
        await this._crc.write(recoveredKey, true);
    }

    private get markedForRecovery() {
        return this._crc.read(markedForRecoveryKey) as boolean;
    }

    private async markForRecovery() {
        await this._crc.write(markedForRecoveryKey, true);
    }

    private recoverySuccess(): void {
        const self = this.audience.getMyself();
        this._containerInfo.set("recoveryUserId", self?.userId);
    }

    /* Log */

    private log(msg: string): void {
        this._recoveryLog = msg;
        this.emit("rollbackInfoChanged");
    }
}

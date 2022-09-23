import {
    AzureClient,
} from "@fluidframework/azure-client";
import { TypedEventEmitter } from "@fluidframework/common-utils";
import { ContainerSchema, IFluidContainer } from "@fluidframework/fluid-static";
import { SharedMap } from '@fluidframework/map';
import { IRunner, IRunnerEvents, IRunnerStatus } from "@fluidframework/runner-interface";
import { timeoutPromise } from "@fluidframework/test-utils";

export interface ContainerTrafficAction {
    action: string;
    target: string;
    key: string;
    value: unknown
}

export interface ContainerTrafficSchema {
    initialObjects: {[key: string]: string},
    dynamicObjects?: {[key: string]: string}
}

export interface ContainerTrafficRunnerConfig {
    client: AzureClient;
    docId: string;
    schema: ContainerTrafficSchema,
    actions: ContainerTrafficAction[],
    flushAfterAction: boolean,
    flushAfterRun: boolean,
}

export class ContainerTrafficRunner extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: ContainerTrafficRunnerConfig;
    constructor(config: ContainerTrafficRunnerConfig) {
        super();
        this.c = config;
    }

    public async run(): Promise<void> {
        const schema: ContainerSchema = {
            initialObjects: {}
        };
        this.loadInitialObjSchema(schema)
        const ac = this.c.client;
        const r = await ac.getContainer(this.c.docId, schema);

        for(const action of this.c.actions) {
            this.runLocalAction(r.container, action)
        }

        await timeoutPromise(
            (resolve) => r.container.once("saved", () => resolve()),
            { durationMs: 10_000, errorMsg: "datastoreSaveAfterAttach timeout" });

        this.emit("status", {
            status: "success",
            description: this.description(),
            details: {},
        });
        return;
    }

    public stop(): void {
        console.log("stop");
    }

    public getStatus(): IRunnerStatus {
        return {
            status: "notstarted",
            description: this.description(),
            details: {},
        };
    }

    private runLocalAction(c: IFluidContainer, trafficAction: ContainerTrafficAction): void {
        if(trafficAction.action === "set") {
            // TODO: handle various DDS types
            const map = c.initialObjects[trafficAction.target] as SharedMap;
            map.set(trafficAction.key, trafficAction.value);
        }
    }

    private loadInitialObjSchema(schema: ContainerSchema): void {
        for(const k of Object.keys(this.c.schema.initialObjects)) {
            if(this.c.schema.initialObjects[k] === "SharedMap") {
                schema.initialObjects[k] = SharedMap;
            }
        }
    }

    private description(): string {
        return `This stage runs traffic on a single container.`
    }
}

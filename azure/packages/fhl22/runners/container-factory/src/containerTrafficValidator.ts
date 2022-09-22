import {
    AzureClient,
} from "@fluidframework/azure-client";
import { TypedEventEmitter } from "@fluidframework/common-utils";
import { ContainerSchema, IFluidContainer } from "@fluidframework/fluid-static";
import { ISharedMap, IValueChanged, SharedMap } from '@fluidframework/map';
import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";

export interface ContainerValidatorAction {
    action: string;
    target: string;
    key: string;
    expectedVal: unknown
}

export interface ContainerTrafficValidatorConfig {
    client: AzureClient;
    docId: string;
    initialObjects: {[key: string]: string},
    dynamicObjects?: {[key: string]: string},
    actions: ContainerValidatorAction[],
    flushAfterAction: boolean,
    flushAfterRun: boolean,
}

export const mapWait = async <T>(map: ISharedMap, key: string): Promise<T> => {
    const maybeValue = map.get<T>(key);
    if (maybeValue !== undefined) {
        return maybeValue;
    }

    return new Promise((resolve) => {
        const handler = (changed: IValueChanged): void => {
            if (changed.key === key) {
                map.off("valueChanged", handler);
                const value = map.get<T>(changed.key);
                if (value === undefined) {
                    throw new Error("Unexpected valueChanged result");
                }
                resolve(value);
            }
        };
        map.on("valueChanged", handler);
    });
};

export class ContainerTrafficValidator extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: ContainerTrafficValidatorConfig;
    constructor(config: ContainerTrafficValidatorConfig) {
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
            await this.runLocalAction(r.container, action)
        }
        return;
    }

    public stop(): void {
        console.log("stop");
    }

    private async runLocalAction(c: IFluidContainer, trafficAction: ContainerValidatorAction): Promise<void> {
        if(trafficAction.action === "get") {
            // TODO: handle various DDS types in more generic way
            const map = c.initialObjects[trafficAction.target] as SharedMap;
            const val: string | undefined = await mapWait(map, trafficAction.key);
            // TODO: do something more useful, throw error for example
            console.log(`Expected value: ${trafficAction.expectedVal}, Actual Value: ${val}`);
        }
    }

    private loadInitialObjSchema(schema: ContainerSchema): void {
        for(const k of Object.keys(this.c.initialObjects)) {
            if(this.c.initialObjects[k] === "SharedMap") {
                schema.initialObjects[k] = SharedMap;
            }
        }
    }
}

import {
    AzureClient,
} from "@fluidframework/azure-client";
import { TypedEventEmitter } from "@fluidframework/common-utils";
import { ContainerSchema } from "@fluidframework/fluid-static";
import { SharedMap } from '@fluidframework/map';
import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";

export interface ContainerFactoryConfig {
    client: AzureClient;
    initialObjects: {[key: string]: string},
    dynamicObjects?: {[key: string]: string}
}

export class ContainerFactory extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: ContainerFactoryConfig;
    constructor(config: ContainerFactoryConfig) {
        super();
        this.c = config;
    }

    public async run(): Promise<string> {
        const schema: ContainerSchema = {
            initialObjects: {}
        };
        this.loadInitialObjSchema(schema)
        const ac = this.c.client;
        const r = await ac.createContainer(schema);
        const c = r.container;
        return c.attach();
    }

    public stop(): void {
        console.log("stop");
    }

    private loadInitialObjSchema(schema: ContainerSchema): void {
        for(const k of Object.keys(this.c.initialObjects)) {
            if(this.c.initialObjects[k] === "SharedMap") {
                schema.initialObjects[k] = SharedMap;
            }
        }
    }
}

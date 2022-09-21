import {
    AzureClient,
} from "@fluidframework/azure-client";
import { TypedEventEmitter } from "@fluidframework/common-utils";
import { IFluidContainer } from "@fluidframework/fluid-static";
import { SharedMap } from '@fluidframework/map';
import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";


export interface ContainerFactoryConfig {
    client: AzureClient;
}

export class ContainerFactory extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: ContainerFactoryConfig;
    constructor(config: ContainerFactoryConfig) {
        super();
        this.c = config;
    }

    public async run(): Promise<IFluidContainer> {
        const containerSchema = {
            initialObjects: {
                /* [id]: DataObject */
                map1: SharedMap,
                map2: SharedMap,
            },
        };
        const ac = this.c.client;
        const r = await ac.createContainer(containerSchema);
        return r.container;
    }

    public stop(): void {
        console.log("stop");
    }
}

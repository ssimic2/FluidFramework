import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";
import { TypedEventEmitter } from "@fluidframework/common-utils";

export interface ContainerConfig {
    id: number,
    layout: string,
    text: string,
    isCreate: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const delay = async (time: number | undefined) => {
    // eslint-disable-next-line promise/param-names
    return new Promise((res) => {
      setTimeout(res, time);
    });
  };

export class ContainerRunner extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: ContainerConfig;
    constructor(config: ContainerConfig) {
        super();
        this.c = config;
    }

    public async run(): Promise<void> {
        return this.createContainer(this.c.isCreate)
    }

    public stop(): void {
        console.log("stop")
    }

    private async createContainer(isCreate: boolean): Promise<void> {
        if (isCreate === true) {
            console.log("Create Container Success")
        } else {
            console.log("Create Container Fail")
        }
    }
}

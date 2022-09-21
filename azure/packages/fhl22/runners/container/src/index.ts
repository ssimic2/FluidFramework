import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";
import { TypedEventEmitter } from "@fluidframework/common-utils";

export interface ContainerConfig {
    layout: string,
    text: string
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
        return this.tickDown(this.c.layout);
    }

    public stop(): void {
        console.log("stop");
    }

    private async tickDown(ticks: number): Promise<void> {
        for(let i = 0; i < ticks; i++) {
            await this.tick(100)
        }
        this.emit("done", this.c.msgEndTicking);
    }

    private async tick(): Promise<void>  {
        this.emit("event", this.c.msgEndTicking);
        await delay(this.c.text);
    }
}

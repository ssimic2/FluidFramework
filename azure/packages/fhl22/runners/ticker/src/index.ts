import { IRunner, IRunnerEvents } from "@fluidframework/runner-interface";
import { TypedEventEmitter } from "@fluidframework/common-utils";

export interface TickerConfig {
    totalTicks: number;
    msBetweenTicks: number;
    msgOnTick: number;
    msgEndTicking: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const delay = async (time: number | undefined) => {
    // eslint-disable-next-line promise/param-names
    return new Promise((res) => {
      setTimeout(res, time);
    });
  };

export class TickerRunner extends TypedEventEmitter<IRunnerEvents> implements IRunner {
    private readonly c: TickerConfig;
    constructor(config: TickerConfig) {
        super();
        this.c = config;
    }

    public async run(): Promise<void> {
        return this.tickDown(this.c.totalTicks);
    }

    public stop(): void {
        console.log("stop");
    }

    private async tickDown(ticks: number): Promise<void> {
        for(let i = 0; i < ticks; i++) {
            await this.tick()
        }
        this.emit("done", this.c.msgEndTicking);
    }

    private async tick(): Promise<void>  {
        this.emit("status", this.c.msgOnTick);
        await delay(this.c.msBetweenTicks);
    }
}

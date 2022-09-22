import { IRunner, IRunnerEvents, IRunnerStatus } from "@fluidframework/runner-interface";
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

    public getStatus(): IRunnerStatus {
        return {
            status: "notstarted",
            description: this.description(),
            details: {
                ticks: this.c.totalTicks,
            },
        };
    }

    public stop(): void {
        console.log("stop");
    }

    private async tickDown(ticks: number): Promise<void> {
        for (let i = 0; i < ticks; i++) {
            await this.tick(i + 1);
        }
        this.emit("status", {
            status: "success",
            description: this.description(),
            details: {
                ticks,
            },
        });
    }

    private description(): string {
        return `This stage run ${this.c.totalTicks} ticks, spaced ${this.c.msBetweenTicks}ms apart.`
    }

    private async tick(idx: number): Promise<void> {
        this.emit("status", {
            status: "running",
            description: this.description(),
            details: {
                ticks: idx,
            },
        });
        await delay(this.c.msBetweenTicks);
    }
}

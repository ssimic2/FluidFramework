import * as fs from "node:fs";
import * as yaml from "js-yaml";

import {
    AzureClientFactory,
    AzureClientFactoryConfig,
    ContainerFactory,
    ContainerFactoryConfig,
    ContainerTrafficRunner,
    ContainerTrafficRunnerConfig,
    ContainerTrafficValidator,
    ContainerTrafficValidatorConfig,
} from "@fluidframework/container-factory";
import { IRunner } from "@fluidframework/runner-interface";
import { TickerConfig, TickerRunner } from "@fluidframework/runner-ticker";

export interface IStageParams {
    [key: string]: unknown;
}
export interface IStage {
    name: string;
    package: string;
    params: IStageParams;
    out: string;
}

export interface RunConfig {
    stages: IStage[];
}

export interface RunConfigs {
    version: string;
    config: RunConfig;
}

export class TestOrchestrator {
    private readonly env = new Map<string, unknown>();

    public static getConfigs(): RunConfigs[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const doc1 = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const doc2 = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const doc3 = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
        return [
            { version: "v1", config: doc1 },
            { version: "v2", config: doc2 },
            { version: "v3", config: doc3 },
        ];
    }

    public async run(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const doc = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
        for (const stage of doc.stages) {
            this.fillEnvForStage(stage.params);
            const runner = this.createRunner(stage);
            if (runner) {
                const r = await this.runStage(runner);
                if (r !== undefined && stage.out !== undefined) {
                    this.env.set(stage.out, r);
                }
                console.log("done with stage", stage.name);
            }
        }
    }

    private fillEnvForStage(params: IStageParams): void {
        for (const key of Object.keys(params)) {
            const val = params[key];
            if (typeof val === "string" && val[0] === "$") {
                params[key] = this.env.get(val);
            }
        }
    }

    private createRunner(stage: IStage): IRunner | undefined {
        switch (stage.package) {
            case "ticker": {
                return new TickerRunner(stage.params as unknown as TickerConfig);
            }
            case "azureFactory": {
                return new AzureClientFactory(stage.params as unknown as AzureClientFactoryConfig);
            }
            case "containerFactory": {
                return new ContainerFactory(stage.params as unknown as ContainerFactoryConfig);
            }
            case "containerTrafficRunner": {
                return new ContainerTrafficRunner(
                    stage.params as unknown as ContainerTrafficRunnerConfig,
                );
            }
            case "containerTrafficValidator": {
                return new ContainerTrafficValidator(
                    stage.params as unknown as ContainerTrafficValidatorConfig,
                );
            }
            default: {
                console.log("unknown stage:", stage);
            }
        }
    }

    private async runStage(runner: IRunner): Promise<unknown> {
        runner.on("status", (e) => {
            console.log("stage event:", e);
        });
        runner.on("done", () => {
            console.log("stage done");
        });
        return runner.run();
    }
}

// const o = new TestOrchestrator()
// o.run()
//     .then(() => {
//         console.log("done---");
//     })
//     .catch((error) => {
//         console.log("error", error);
//     });

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

export interface VersionedRunConfig {
    version: string;
    config: RunConfig;
}

export interface TestOrchestratorConfig {
    version: string;
}
export class TestOrchestrator {
    private readonly env = new Map<string, unknown>();
    private readonly c: TestOrchestratorConfig;

    constructor(config: TestOrchestratorConfig) {
        this.c = config;
    }

    public static getConfigs(): VersionedRunConfig[] {
        return [
            { version: "v1", config: this.getConfig("v1") },
            { version: "v2", config: this.getConfig("v2") },
            { version: "v3", config: this.getConfig("v3") },
        ];
    }

    public static getConfig(version: string): RunConfig {
        return yaml.load(fs.readFileSync(this.getConfigFileName(version), "utf8")) as RunConfig;
    }

    public async run(): Promise<void> {
        console.log("running config version:", this.c.version)
        const doc = TestOrchestrator.getConfig(this.c.version)
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

    private static getConfigFileName(version: string): string {
        switch (version) {
            case "v1": {
                return "./testConfig.yml"
            }
            case "v2": {
                return "./testConfig.yml"
            }
            case "v3": {
                return "./testConfig.yml"
            }
            default: {
                return ""
            }
        }
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

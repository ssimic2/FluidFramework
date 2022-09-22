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
    id: number;
    description?: string;
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

export type StageStatus = "notstarted" | "running" | "success" | "error";
export interface IStageStatus{
    id: number;
    title: string;
    description?: string;
    status: StageStatus;
    details: unknown;
}

export class TestOrchestrator {
    private readonly env = new Map<string, unknown>();
    private readonly stageStatus = new Map<number, IStageStatus>();
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
                const r = await this.runStage(runner, stage);
                if (r !== undefined && stage.out !== undefined) {
                    this.env.set(stage.out, r);
                }
                console.log("done with stage", stage.name);
            }
        }
    }

    public getStatus(): IStageStatus[] {
        const r: IStageStatus[] = [];
        for(const [, value] of this.stageStatus) {
            r.push(value)
        }
        return r.sort((a, b) => a.id < b.id ? -1 : 1);
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

    private async runStage(runner: IRunner, stage: IStage): Promise<unknown> {
        runner.on("status", (e) => {
            this.stageStatus.set(stage.id, {
                id: stage.id,
                title: stage.name,
                description: stage.description,
                status: e.status,
                details: e.details,
            })
            console.log("stage event->:", this.stageStatus);
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

const o = new TestOrchestrator({version: "v1"})
o.run()
    .then(() => {
        console.log("done---");
    })
    .catch((error) => {
        console.log("error", error);
    });

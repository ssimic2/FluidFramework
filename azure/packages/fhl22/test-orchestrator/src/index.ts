import * as fs from "node:fs";
import * as yaml from "js-yaml";

import {
    AzureClientFactory,
    AzureClientFactoryConfig,
    ContainerFactory,
    ContainerFactoryConfig,
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

const env = new Map<string, unknown>();

export async function run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const doc = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
    for (const stage of doc.stages) {
        fillEnvForStage(stage.params);
        const runner = createRunner(stage);
        if (runner) {
            const r = await runStage(runner);
            if (r !== undefined && stage.out !== undefined) {
                env.set(stage.out, r);
            }
        }
    }
}

function fillEnvForStage(params: IStageParams): void {
    for (const key of Object.keys(params)) {
        const val = params[key];
        if (typeof val === "string" && val[0] === "$") {
            params[key] = env.get(val);
        }
    }
}

function createRunner(stage: IStage): IRunner | undefined {
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
        default: {
            console.log("unknown stage:", stage);
        }
    }
}

export async function runStage(runner: IRunner): Promise<unknown> {
    runner.on("status", (e) => {
        console.log("stage event:", e);
    });
    runner.on("done", () => {
        console.log("stage done");
    });
    return runner.run();
}

run()
    .then(() => {
        console.log("done");
    })
    .catch((error) => {
        console.log("error", error);
    });

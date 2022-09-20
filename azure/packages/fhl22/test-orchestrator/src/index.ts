import * as fs from "node:fs";
import * as yaml from "js-yaml";

import { IRunner } from "@fluidframework/runner-interface";
import { TickerConfig, TickerRunner } from "@fluidframework/runner-ticker";

export interface IStage {
    name: string;
    package: string;
    params: unknown;
}

export interface RunConfig {
    stages: IStage[];
}

export async function run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const doc = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
    for(const item of doc.stages) {
        if(item.package === "ticker") {
            const ticker = new TickerRunner(item.params as TickerConfig);
            await runStage(ticker);
        } else {
            console.log("unknown stage-----", item)
        }
    }
}

export async function runStage(runner: IRunner): Promise<void> {
    runner.on("status", (e) => {console.log("ticker event:", e)})
    runner.on("done", () => {console.log("ticker done")})
    await runner.run()
}

run().then(() => {
    console.log("done");
}).catch((error) => {
    console.log("error", error);
});


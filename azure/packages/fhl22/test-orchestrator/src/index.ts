import * as fs from "node:fs";
import * as yaml from "js-yaml";

import { TickerConfig, TickerRunner } from "@fluidframework/runner-ticker"

export interface IStage {
    name: string;
    package: string;
    params: unknown;
}

export interface RunConfig {
    stages: IStage[];
}

// Get document, or throw exception on error
try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const doc = yaml.load(fs.readFileSync("./testConfig.yml", "utf8")) as RunConfig;
    for(const item of doc.stages) {
        if(item.package === "ticker") {
            const ticker = new TickerRunner(item.params as TickerConfig);
            ticker.on("event", (e) => {console.log("ticker event", e)})
            ticker.on("done", (e) => {console.log("ticker done", e)})
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            ticker.run().then(() => {
                console.log("done");
            }).catch((error) => {
                console.log("error", error);
            });
        } else if (item.package === "container") {
            const container = new ContainerRunner(item.params as ContainerConfig);
            console.log("Container Detected!")
        } else {
           console.log("unknown stage-----", item)
        }
    }
    console.log(doc);
} catch (error) {
    console.log(error);
}


import http from "node:http";
import url from "node:url";
import { v4 as uuid } from "uuid";
import { TestOrchestrator } from "./index";

console.log("server running");

const runs = new Map<string, TestOrchestrator>();
const validConfigVersions = new Set(["v1", "v2", "v3"]);
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" }); // http header
    if (req.url === undefined) {
        res.end();
        return;
    }
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    if (method === "GET") {
        if (parsedUrl.pathname === "/configs") {
            res.write(JSON.stringify(TestOrchestrator.getConfigs()));
        }
        if (parsedUrl.pathname === "/run") {
            const o = runs.get(parsedUrl.query.id as string);
            const status = o?.getStatus() ?? { error: "cannot find the requested run" };
            res.write(JSON.stringify(status));
        } else {
            res.write("<h1>POLLING DATA!<h1>"); // write a response
        }
        res.end(); // end the response
    } else if (method === "POST") {
        if (parsedUrl.pathname === "/run") {
            const v = parsedUrl.query.configVersion as string;
            if (!validConfigVersions.has(v)) {
                res.write(JSON.stringify({ error: "invalid config version" }));
                res.end();
                return;
            }
            const o = new TestOrchestrator({ version: v });
            const runId = uuid();
            runs.set(runId, o);
            o.run()
                .then(() => console.log("run done", runId))
                .catch(() => console.log("run failed", runId));
            res.write(JSON.stringify({ runId }));
        } else {
            res.write("<h1>POLLING DATA!<h1>"); // write a response
        }
        res.end(); // end the r
    }
}).listen(8080, () => {
    console.log("server start at port 8080"); // the server object listens on port 3000
});

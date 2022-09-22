import http from "node:http";
import url from "node:url";
import { v4 as uuid } from "uuid";
import { TestOrchestrator } from "./index";

console.log("server running");

const runs = new Map<string, TestOrchestrator>();
http.createServer((req, res) => {
    const headers ={
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    }
    res.writeHead(200, headers); // http header
    if(req.url === undefined) {
        res.end();
        return;
    }
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    if (method === "GET") {
        if (parsedUrl.pathname === "/configs") {
            res.write(JSON.stringify(TestOrchestrator.getConfigs()));
        } else {
            res.write("<h1>POLLING DATA!<h1>"); // write a response
        }
        res.end(); // end the response
    } else if (method === "POST") {
        if (parsedUrl.pathname === "/run") {
            const o = new TestOrchestrator({version: parsedUrl.query.version as string});
            const runId = uuid();
            runs.set(runId, o)
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

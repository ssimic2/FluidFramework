import http from 'node:http';
import { TestOrchestrator } from './index'

console.log("server running")
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
    // const url = req.url;
    const method = req.method;
    if (method === "GET"){
        if(req.url === "/configs") {
            res.write(JSON.stringify(TestOrchestrator.getConfigs()))
        } else {
            res.write('<h1>POLLING DATA!<h1>'); // write a response
        }
        res.end(); // end the response
    }

}).listen(8080, ()=> {
    console.log("server start at port 8080"); // the server object listens on port 3000
});


import http from 'node:http';
import { run } from './index'

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
    // const url = req.url;
    const method = req.method;

    if(method === "POST"){
        run().then(() => {
            res.write('<h1>RUNNING COMPLETE!<h1>');
            res.end(); // end the response
        }).catch(() => {
            return
        })
    } else if (method === "GET"){
        res.write('<h1>POLLING DATA!<h1>'); // write a response
        res.end(); // end the response
    }

}).listen(8080, ()=> {
    console.log("server start at port 8080"); // the server object listens on port 3000
});

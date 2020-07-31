const express = require('express');
const fs = require('fs');
// npm install jade
const jade = require('jade');

const app = express();
const port = 3000;

app.use((req, res) => {
    fs.readFile('jadetest1.jade', 'utf-8', (err, data) => {
        let fn = jade.compile(data);
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(fn()); // 메소드형태로 보냄
    });
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
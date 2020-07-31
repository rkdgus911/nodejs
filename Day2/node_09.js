const express = require('express');
const fs = require('fs');
// npm install ejs
const ejs = require('ejs');

const app = express();
const port = 3000;

app.use((req, res) => {
    let value = {userid:'apple', userpw:'1234'};
    fs.readFile('ejstest2.ejs', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(ejs.render(data, value));
    });
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
const express = require('express');
const fs = require('fs');
// npm install ejs
const ejs = require('ejs');

const app = express();
const port = 3000;

app.use((req, res) => {
    fs.readFile('ejstest1.ejs', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(ejs.render(data));
    });
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
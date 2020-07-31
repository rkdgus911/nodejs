const express = require('express');
const static = require('serve-static');
const path = require('path');
const app = express();
const port = 3000;

app.use(static(path.join(__dirname, 'public'))); // __dirname 현재 public 폴더
var router = express.Router();

app.get('/rain', (req, res) => {
    res.send("hello rain, <img src='/rain.png'>");
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
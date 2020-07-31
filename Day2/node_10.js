const express = require('express');
const fs = require('fs');
// npm install ejs
const ejs = require('ejs');

const app = express();
const port = 3000;

let body = fs.readFileSync('body.ejs', 'utf-8');
let content = fs.readFileSync('content.ejs', 'utf-8');

app.use((req, res) => { // content:<%-content%> , render(content):content.ejs
    let html = ejs.render(body, {title:'제목입니다.', content: ejs.render(content, {message:'텍스트 메세지'})});
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(html);
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
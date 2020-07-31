const express = require('express');
const app = express();
const port = 3000;

app.use((req, res) => {
    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'}); 
    res.end('<h2>익스프레스 서버에서 응답한 메세지입니다.</h2>');
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
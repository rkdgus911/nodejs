// npm install express
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('익스프레스 서버로 전송한 메세지!'); // 사용자에게 특정 데이터를 전달할 때 쓰는 데이터
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
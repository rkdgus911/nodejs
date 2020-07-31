const express = require('express');
const app = express();
const port = 3000;

app.use((req, res) => {
    console.log('미들웨어 실행!');
    res.redirect('https://www.google.com');
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
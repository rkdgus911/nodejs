const express = require('express');
const bodyparser = require('body-parser'); // 이게 있어야 가져올 수 있다.
const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res) => {
    console.log('미들웨어 실행');
    let paramUserid = req.body.userid; // query가 아니라 body로 받는건 post 방식
    let paramUserpw = req.body.userpw;

    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h2>익스프레스 서버에서 응답한 메세지입니다.</h2>'); // 버퍼에다가 담아준다.
    res.write('<p>paramUserid : ' + paramUserid + '</p>');
    res.write('<p>paramUserpw : ' + paramUserpw + '</p>');
    res.end(); // end()에 값을 넣어도 되는데 write를 사용해 버퍼에 담은 후 end()를 사용하면 출력한다.

});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
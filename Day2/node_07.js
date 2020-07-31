const express = require('express');
const bodyparser = require('body-parser'); // 이게 있어야 가져올 수 있다.
const app = express();
const port = 3000;
const fs = require('fs');

app.use(bodyparser.urlencoded({ extended: false }));

let router = express.Router();

router.route('/member/login').get((req, res) => {
    fs.readFile("login.html", "utf-8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/member/loginOk').post((req, res) => { 
    let paramUserid = req.body.userid;
    let paramUserpw = req.body.userpw;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h2>로그인 결과</h2>'); // 버퍼에다가 담아준다.
    res.write('<p>아이디 : ' + paramUserid + '</p>');
    res.write('<p>비밀번호 : ' + paramUserpw + '</p>');
    res.end(); // end()에 값을 넣어도 되는데 write를 사용해 버퍼에 담은 후 end()를 사용하면 출력한다.
});

app.use('/' , router); // '/' 루트 , router에 저장된 걸 가져온다.
app.all('*', (req, res) => { // * 나머지
    res.status(404).send('<h2>페이지를 찾을 수 없습니다.</h2>');
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
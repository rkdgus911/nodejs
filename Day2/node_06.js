const express = require('express');
const bodyparser = require('body-parser'); // 이게 있어야 가져올 수 있다.
const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended: false }));

let router = express.Router();

router.route('/member/login').post((req, res) => {
    let paramUserid = req.body.userid;
    let paramUserpw = req.body.userpw;

    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h2>익스프레스 서버에서 응답한 메세지입니다.</h2>'); // 버퍼에다가 담아준다.
    res.write('<p>paramUserid : ' + paramUserid + '</p>');
    res.write('<p>paramUserpw : ' + paramUserpw + '</p>');
    res.end(); // end()에 값을 넣어도 되는데 write를 사용해 버퍼에 담은 후 end()를 사용하면 출력한다.
});

router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 페이지 호출!');
});

app.use('/' , router); // '/' 루트 , router에 저장된 걸 가져온다. /member/login , /member/regist
app.all('*', (req, res) => { // * 나머지
    res.status(404).send('<h2>페이지를 찾을 수 없습니다.</h2>');
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
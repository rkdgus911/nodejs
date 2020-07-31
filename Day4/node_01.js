const express = require('express'); // 웹 서버를 가져다 쓰겠다.
// npm install cookie-parser
const cookieParser = require('cookie-parser'); // 쿠키를 사용하기 위해

let app = express();
let port = 3000;

app.use(cookieParser()); // req, res에 등록이 될 때 쿠키를 사용할 수 있게 된다.

app.get('/setCookie', (req, res) => {
    console.log('setCookie 호출');
    res.cookie('member', // member 키
        {  // 중괄호에 값을 넣어주겠다.
            id: 'apple',
            name: '김사과',
            gender: 'female'
        },
        {  // 옵션을 주겠다.
            maxAge: 1000 * 60 * 60 // 1시간
        });
    res.redirect('/showCookie');
});

app.get('/showCookie', (req, res) => {
    console.log('showCookie 호출');
    res.send(req.cookies); // 사용자에게 보여줄꺼야
    res.end(); // 전달하게 되면 사용자에게 저장되었던 쿠키를 보내주게 된다.
});

app.listen(port, () => {
    console.log("Server listening on port : " + port);
});
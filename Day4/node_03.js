const express = require('express');
//npm install express-session
const expressSession = require('express-session');
const fs = require('fs');

let app = express();
let port = 3000;

// app.use(bodyparser.urlencoded({extends: false}));

app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false,
    saveUninitialized: true
}));

app.get('/login', (req, res) => {
    let userId = req.query.userid;
    let userPw = req.query.userpw;
    let userName = req.query.username;

    if(req.session.member){
        console.log('이미 로그인 중입니다');
        res.redirect('/main');
    }else{
        req.session.member = {
            userid: userId,
            name: userName,
            isAuth: true
        };
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write('<h2>세션이 생성되었습니다</h2>');
        res.write('<p>아이디 : ' + userId + '</p>');
        res.write('<p>비밀번호 : ' + userPw + '</p>');
        res.write('<p>이름 : ' + userName + '</p>');
        res.write('<p><a href="/main">메인으로 이동</a></p>');
        res.end();
    }
});

app.use('/main', (req, res) => {
    if(req.session.member) {
        fs.readFile('welcome.html', (err, data) => {
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(data);
        });
    }else{
        fs.readFile('fail.html', (err, data) => {
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(data);
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('세션이 삭제되었습니다.');
    });
    res.redirect('/main');
});

app.listen(port, () => {
    console.log("Server listening on port : " + port);
});
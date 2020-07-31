const express = require('express');
const expressSession = require('express-session');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');

let app = express();
let port = 3000;

app.use(bodyparser.urlencoded({extends: false}));

app.get('/signup', (req, res) => {
    fs.readFile('signup.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

app.post('/signupOk', (req, res) => {
    let userid = req.params.userid;
    if(!req.body["userid"] || !req.body["userpw"] || !req.body["username"] || !req.body["gender"]){
        res.json(result);
        res.redirect('/login');
        return false;
    }
    fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
        let member = JSON.parse(data);
        if(member[number]){
            res.json(result);
            return false;
        }
        console.log(req.body);
        member[number] = req.body;
        fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(lists, null, '\t'), 'utf8', (err, data) => {
            result["success"] = 200;
            result["msg"] = "success";
            res.json(result);
        });
    });
});

app.get('/login', (req, res) => {
    let userId = req.query.userid;
    let userPw = req.query.userpw;
    let userName = req.query.username;
    let Gender = req.query.gender;

    if(req.session.member){
        res.redirect('/main');
    }else{
        req.session.member = {
            userid: userId,
            username: userName,
            gender: Gender,
            isAuth: ture 
        };
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write('<h2>세션이 생성되었습니다</h2>');
        res.write('<p>아이디 : ' + userId + '</p>');
        res.write('<p>비밀번호 : ' + userPw + '</p>');
        res.write('<p>이름 : ' + userName + '</p>');
        res.write('<p>성별 : ' + Gender + '</p>');
        res.write('<p><a href="/main">메인으로 이동</a></p>');
        res.end();
    }
});

app.post('/signupOk/:userid', (req, res) => {
    let result = {};
    let userid = req.params.userid;
    if(!req.body["userid"] || !req.body["userpw"] || !req.body["username"] || !req.body["gender"]){
        result["success"] = 100;
        result["msg"] = "invalid request";
        res.json(result);
        return false;
    }
    fs.readFile(__dirname + "/../data/Member.json", "utf8", (err, data) => {
        let member = JSON.parse(data);
        if(member[userid]){
            result["success"] = 100;
            result["msg"] = "duplicate";
            res.json(result);
            return false;
        }
        console.log(req.body);
        member[userid] = req.body;
        fs.writeFile(__dirname + "/../data/Member.json", JSON.stringify(lists, null, '\t'), 'utf8', (err, data) => {
            result["success"] = 200;
            result["msg"] = "success";
            res.json(result);
        });
    });
});

app.use('/main', (req, res) => {
    if(req.session.member){
        fs.readFile('login2.html', (err, data) => {
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(data);
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('세션 삭제');
    });
    res.readFile('/login2');
});
app.listen(port, () => {
    console.log("Server listening on port : " + port);
});


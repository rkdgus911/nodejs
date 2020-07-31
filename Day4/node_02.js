const express = require('express');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fs = require('fs');

let app = express();
let port = 3000;

app.use(bodyparser.urlencoded({extends: false}));
app.use(cookieParser('!@#$%^&*()')); // 포함해서 암호화해라

app.get('/login', (req, res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

app.post('/loginOk', (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    console.log(userid);
    console.log(userpw);

    if(userid == "admin" && userpw == "1111"){
        let expiresDay = new Date(Date.now() + (1000 * 60 * 60 * 24));
        res.cookie('userid', userid, { expires: expiresDay, signed: true });
        res.redirect('/welcome');
    }else{
        res.redirect('fail');
    }
});

app.get('/welcome', (req, res) => {
    let cookieUserid = req.signedCookies.userid;
    console.log(cookieUserid);
    if(cookieUserid){
        fs.readFile('welcome.html', 'utf8', (err, data) => {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        });
    }else{
        res.redirect('/login');
    }
});

app.get('/fail', (req, res) => {
    fs.readFile('fail.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie("userid"); // userid키를 지운다.
    res.redirect("/login");
});

app.listen(port, () => {
    console.log("Server listening on port : " + port);
});
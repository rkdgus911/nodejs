const express = require('express');
const bodyparser = require('body-parser'); // 이게 있어야 가져올 수 있다.
const app = express();
const port = 3000;
const static = require('serve-static');
const path = require('path');
const fs = require('fs');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(static(path.join(__dirname, '/css')));
app.use(static(path.join(__dirname, '/img')));

let router = express.Router();

router.route('/index').get((req, res) => {
    fs.readFile("index.ejs", "utf-8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/login').get((req, res) => {
    fs.readFile("login.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/join').get((req, res) => {
    fs.readFile("join.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/mypage').get((req, res) => {
    fs.readFile("mypage.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/notice_list').get((req, res) => {
    fs.readFile("notice_list.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/notice_view').get((req, res) => {
    fs.readFile("notice_view.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/program').get((req, res) => {
    fs.readFile("program.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

router.route('/template').get((req, res) => {
    fs.readFile("template.ejs", "utf8", (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

app.use('/' , router); // '/' 루트 , router에 저장된 걸 가져온다.
app.all('*', (req, res) => { // * 나머지
    res.status(404).send('<h2>페이지를 찾을 수 없습니다.</h2>');
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
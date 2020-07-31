let http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>http 모듈</title></head><body><h2>http 모듈</h2><p>http 모듈로 전송된 html 문서입니다.</p></body></html>');
}).listen(3000, () => {
    console.log('서버 실행중...');
});
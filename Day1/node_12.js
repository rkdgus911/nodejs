let http = require('http');
let fs = require('fs');

http.createServer((req, res) => {
    fs.readFile('nodejs.png', (err, data) => {
        if(!err){
            res.writeHead(200, {'Content-Type':'image/png'});
            res.end(data);
        }else{
            console.log(err);
        }
    });
}).listen(3000, () => {
    console.log('3000번 포트 서버 실행중....');
});

http.createServer((req, res) => {
    fs.readFile('sun.mp3', (err, data) => {
        if(!err){
            res.writeHead(200, {'Content-Type':'audio/mp3'});
            res.end(data);
        }else{
            console.log(err);
        }
    });
}).listen(3001, () => {
    console.log('3001번 포트 서버 실행중...');
});
let http = require('http');
let fs = require('fs');
const { response } = require('express');

http.createServer((req , res) => {
    fs.readFile('login.html', (err,data) => {
        if(!err){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }else{
            console.log(err);
        }
    });
}).listen(3000, () => {
    console.log('서버 실행중...');
});

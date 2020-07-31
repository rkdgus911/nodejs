let http = require('http');
let server = http.createServer();

server.on('request', ()=> {
    console.log('request 이벤트 발생!');
});

server.on('connection', () => {
    console.log('connection 이벤트 발생!');
});

server.listen(3000); // 포트번호
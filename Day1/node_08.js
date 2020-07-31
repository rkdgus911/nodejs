const http = require('http'); // require 모듈을 가져오는 것, http 웹서버를 띄어주는 모듈, const 상수(한번 입력하면 변경x)

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => { // 웹 서버를 다를 수 있게 사용자 정보 req , 사용자에게 전달 res
  res.statusCode = 200; // 사용자에게 호출코드를 전달
  res.setHeader('Content-Type', 'text/plain'); // 사용자에게 전달할 때 브라우저를 알려준다. text/plain 일반적인 문자열
  res.end('Hello World'); // 사용자에게 눈으로 볼 수 있는 body가 전달
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
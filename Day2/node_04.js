const express = require('express');
const app = express();
const port = 3000;

app.use((req, res) => {
    console.log('미들웨어 실행!');
    let userAgent = req.header('User-Agent'); 
    console.log(userAgent);
    // localhost:3000/?userid=apple (GET방식!!)
    let paramUserid = req.query.userid; // userid에 apple이 들어가게 된다.
    console.log(paramUserid);

    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h2>익스프레스 서버에서 응답한 메세지입니다.</h2>'); // 버퍼에다가 담아준다.
    res.write('<p>User-Agent : ' + userAgent + '</p>');
    res.write('<p>paramUserid : ' + paramUserid + '</p>'); 
    res.end(); // end()에 값을 넣어도 되는데 write를 사용해 버퍼에 담은 후 end()를 사용하면 출력한다.
});

app.listen(port, () => {
    console.log("Server Listening on port : " + port);
});
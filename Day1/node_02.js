let fs = require('fs');
let data = '안녕하세요. Node.js !!';

fs.writeFile('text3.txt', data, 'utf-8', (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('비동기식으로 성공적으로 파일을 썼습니다.');
    }
});

fs.writeFileSync('text2.txt', data, "utf-8");
console.log('동기식으로 성공적으로 파일을 썼습니다.');
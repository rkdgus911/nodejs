let fs = require('fs');

try{
    let text = fs.readFileSync('text1.txt', 'utf-8');
    console.log(text);
}catch(e){
    // console.log(e);
    console.log('예외가 발생했어요.');
}

// 비동기식은 예외처리를 할 필요가 없습니다.
fs.readFile("text1.txt", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
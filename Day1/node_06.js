process.on('exit', () => {
    console.log('안녕히가세요!');
});

process.on('uncaughtException', (err) => {
    console.log('예외가 발생했습니다.');
});

let count = 0;
let id = setInterval(() => { // 해당 시간마다 실행
    count++;
    if(count == 5){
        clearInterval(id);
    }
    error.error.error(); // 강제로 예외상황을 발생시키는 메소드(uncaughtException)
}, 3000); // 3초마다 실행
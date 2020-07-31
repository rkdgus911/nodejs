process.on('exit', () => {
    console.log('exit 이벤트 발생!');
});

setTimeout(() => {  // 특정 시간이 지나고 함수를 실행해주는 거
    console.log('3초 후 종료');
    process.exit;
}, 3000);
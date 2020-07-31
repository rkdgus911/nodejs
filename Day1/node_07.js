process.on('exit', () => {
    console.log('안녕히가세요!');
});

process.emit('exit'); // emit()로 발생시킨 exit는 실제로 프로그램이 종료되지 않음 
process.emit('exit');
process.emit('exit');

process.exit(); // 실제 프로그램을 종료
console.log('프로그램을 종료합니다.');
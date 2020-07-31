let events = require('events');
let eventEmitter = new events.EventEmitter(); // 이벤트 관련 메소드를 사용할 수 있는 객체를 만듭니다.

let connectHandler = function connected(){ // 2. connectHandler 실행
    console.log('연결 성공!');
    eventEmitter.emit('data_received');
}

eventEmitter.on('connection', connectHandler); // 이벤트 연결

eventEmitter.on('data_received', () => { // 3. 익명 함수 실행
    console.log('데이터 수신');
});

eventEmitter.emit('connection'); // 1. connection 이벤트 발생! 
console.log('프로그램을 종료합니다.'); // 4. 종료
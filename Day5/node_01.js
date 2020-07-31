const express = require('express');
const bodyParser = require('body-parser');
// npm install mongodb
let MongoClient = require('mongodb').MongoClient;
let app = express();
let port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
let database;

let router = express.Router();
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출');
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    console.log('요청 파라미터 : ' + userId + ", " + userPw);
    if(database){
        loginMember(database, userId, userPw, (err, docs) => {
            if(err){
                console.log(err);
            }
            if(docs){
                console.dir(docs); // dir : 객체 내용까지 찍어준다.
                let docUserid = docs[0].userid;
                let docPass = docs[0].pass;
                let docName = docs[0].name;
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공!</h2>');
                res.write('<p>아이디 : ' + docUserid + '</p>');
                res.write('<p>비밀번호 : ' + docPass + '</p>');
                res.write('<p>이름 : ' + docName + '</p>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>');
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출');
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let userName = req.body.username;
    let userAge = req.body.userage;

    console.log('요청 파라미터 : ' + userId + ", " + userPw + ", " + userName + ", " + userAge);
    if(database){
        addMember(database, userId, userPw, userName, userAge, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result.insertedCount > 0){
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공!</h2>');
                res.write('<p>회원가입이 성공적으로 되었습니다.</p>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>회원가입에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

router.route('/member/edit').post((req, res) => {
    console.log('/member/edit 호출');
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let userName = req.body.username;
    let userAge = req.body.userage;

    console.log('요청 파라미터 : ' + userId + ", " + userPw + ", " + userName + ", " + userAge);
    
    if(database){   // err, result 가 만들어지는 콜백 호출
        editMember(database, userId, userPw, userName, userAge, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result.modifiedCount > 0){
                console.dir(result); // 객체에 뭐가 들어있나 확인
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>정보수정 성공!</h2>');
                res.write('<p>정보수정에 성공했습니다.</p>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>정보수정 실패!</h2>');
                res.write('<p>정보수정에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

function connectDB(){
    let databaseUrl = "mongodb://localhost:27017"; // mongdb 포트번호
    MongoClient.connect(databaseUrl, (err, db) => {
        if(err){
            console.log(err);
        }else{
            let tempdb = db.db('nodedb'); // 연결이 되면 db객체가 만들어지게 되는데 세팅해서 객체가 만들어지면 tempdb로
            database = tempdb;
            console.log("데이터베이스 연결 성공!");
        }
    });
}

let loginMember = function(database, userId, userPw, callback){
    console.log('loginMember 호출 : ' + userId +", " + userPw);
    let members = database.collection('member'); // 컬렉션에 해당하는 객체들을 가져와 members에 저장
    members.find({userid:userId, pass:userPw}).toArray((err, docs) => {
        if(err){
            console.log(err);
            callback(err, null); // 에러객체는 앞에다 전달하고 뒤에는 전달할 게 없다.
            return;
        }
        if(docs.length > 0){
            console.log("사용자를 찾았습니다.");
            callback(null, docs);
        }else{
            console.log("일치하는 사용자를 찾지 못했습니다.");
            callback(null, null);
        }
    });
}

let addMember = function(database, userId, userPw, userName, userAge, callback){
    console.log('addMember 호출');
    let members = database.collection('member');

    members.insertMany([{userid:userId, pass:userPw, name:userName, age:userAge}], (err, result) => { // (err, result) 콜백
        if(err){
            console.log(err);
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('사용자 document 추가 : ' + result.insertedCount);
        }else{
            console.log('사용자 document 추가되지 않음');
        }
        callback(null, result);
    });
}

let editMember = function(database, userId, userPw, userName, userAge, callback){
    console.log('editMember 호출');
    let members = database.collection('member'); // member 컬렉션을 가져옴
    members.updateOne({userid:userId}, {$set:{userid:userId, pass:userPw, name:userName, age:userAge}}, (err, result) => {
        if(err){
            callback(err, null);
            return;
        }
        if(result.modifiedCount > 0){
            console.log('사용자 document 수정됨 : ' + result.modifiedCount);
        }else{
            console.log('수정된 document가 없음');
        }
        callback(null, result); // 결과는 없고 result값만 있는 콜백을 보내준다.
    });
}

app.use("/", router);

app.listen(port, () => {
    console.log("Server listening on port : " + port);
    connectDB();
});
const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
// npm install mongoose
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');

let app = express();
let port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', static(path.join(__dirname, 'public'))); // public 폴더를 만들고 붙이겠다.
app.use(logger('dev')); // 페이지에 호출할 때 마다 알려주는거

// 데이터 베이스 연결
let database;
let UserSchema; // 데이터 베이스 스키마(필드정의)
let UserModel; // 데이터 베이스 모델

function connectDB(){
    let Url = "mongodb://localhost:27017/nodedb";

    console.log('데이터베이스 연결 시도...');
    mongoose.Promise = global.Promise; // global : node.js에서 익스프레스 서버에서 전역적으로 사용할수 있게 합니다.
    // 몽구스의 프로미스 객체는 global의 프로미스 객체로 사용할 수 있게 합니다.
    mongoose.connect(Url, { useNewUrlParser: true, useUnifiedTopology: true } );
    database = mongoose.connection; // database에 몽구스에 커넥션한걸 연결시켜준다.

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', () => {
        console.log('데이터베이스 연결 성공!');

        UserSchema = mongoose.Schema({
            userid: String,
            userpw: String,
            name: String,
            gender: String
        });
        console.log('UserSchema 생성 완료');

        // findAll 속성
        UserSchema.static('findAll', function(callback) { // findAll 이라는 함수를 등록시켜준다.
            return this.find({}, callback); // 검색어 없이 현재 객체를 찾아주고 리턴시켜주는
        });

        UserModel = mongoose.model("users", UserSchema);
        console.log('UserModel이 정의 되었습니다.');
    });
}

let router = express.Router();

router.route('/member/login').post((req, res) => {
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    
    console.log('요청 파라미터 : ' + userId + ', ' + userPw);

    if(database){
        loginMember(database, userId, userPw, (err, docs) => {
            if(err) { console.log(err); }
            if(docs) { 
                console.dir(docs);
                let username = docs[0].name;
                let gender = docs[0].gender;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공!</h2>');
                res.write('<p>아이디 : ' + userId + '</p>');
                res.write('<p>비밀번호 : ' + userPw + '</p>');
                res.write('<p>이름 : ' + username + '</p>');
                res.write('<p>성별 : ' + gender + '</p>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패!</h2>');
                res.write('<p>아이디 또는 비밀번호를 확인하세요!</p>');
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<p>데이터 베이스 연결하지 못했습니다.</p>');
    }
});

router.route('/member/regist').post((req, res) => {
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let Name = req.body.name;
    let Gender = req.body.gender;

    console.log('요청 파라미터 : ' + userId + ', ' + userPw + ', ' + Name + ', ' + Gender);
    if(database){
        addMember(database, userId, userPw, Name, Gender, (err, result) => {
            if(err){ console.log(err); }
            if(result){
                console.dir(result);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공!</h2>');
                res.write('<p>회원가입에 성공했습니다.</p>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>회원가입에 실패했습니다.</p>');
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<p>데이터 베이스 연결하지 못했습니다.</p>');
    }
});

router.route('/member/list').get((req, res) => {
    if(database){
        UserModel.findAll((err, result) => {
            if(err){
                console.log('리스트 조회 실패')
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>리스트 조회 실패</h2>');
                res.write('<p>리스트를 가져오지 못했습니다.</p>');
                res.end();
            }
            if(result){
                console.dir(result);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원리스트</h2>');
                res.write('<div><ul>');
                for(let i=0; i<result.length; i++){
                    let userId = result[i]._doc.userid; // 문서에 접근할 때는 _doc
                    let Name = result[i]._doc.name;
                    let Gender = result[i]._doc.gender;
                    res.write("<li>" + i + " : " + userId + ", " + Name + ", " + Gender + "</li>");
                }
                res.write('</ul></div>');
                res.end();
            }else{
                console.log('데이터 없음')
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원리스트</h2>');
                res.write('<p>회원리스트가 없습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<p>데이터 베이스 연결하지 못했습니다.</p>');
    }
});

app.use('/', router);

// 사용자 인증하는 함수
let loginMember = function(database, userId, userPw, callback){
    console.log("loginMember 호출 : " + userId + ", " + userPw);

    UserModel.find({userid:userId, userpw:userPw}, (err, result) => {
        if(err){
            callback(err, null);
            return;
        }
        if(result.length > 0){
            console.log("일치하는 사용자를 찾았습니다.");
            callback(null, result);
        }else{
            console.log("일치하는 사용자가 없습니다.");
            callback(null, null);
        }
    });
}

let addMember = function(database, userId, userPw, Name, Gender, callback){
    console.log('addMember 호출!');
    let members = new UserModel({userid:userId, userpw:userPw, name:Name, gender:Gender});

    members.save((err, result) => {
        if(err){
            callback(err, null);
            return;
        }
        console.log("회원 document 추가되었습니다.");
        callback(null, result);
    });
}

app.listen(port, () => {
    console.log("Server listening on port : " + port);
    connectDB();
});
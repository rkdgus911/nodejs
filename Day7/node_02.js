const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
// npm install crypto 암호화시키기 위한 모듈
const crypto = require('crypto');

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

        //user 스키마 및 모델 객체 생성
        createUserSchema();
    });
}

// user 스키마 및 모델 객체 생성
function createUserSchema() {
    UserSchema = mongoose.Schema({
        userid: {type: String, required: true, unique: true, default:''}, // required 무조건 들어가고 유니크해야하고 디폴드 값은 없어, index 속도증가!!(primary키에 들어있는), index 안걸어줘도 됨 유니크땜에
        hashed_password: {type: String, required:true, default: ''},
        salt: {type: String, required: true}, // salt : 암호화시킬 때 키값
        name: {type: String, required: true, default: ''},
        age: {type: Number, default: 0},
        create_at: {type: Date, index: {unique: false}, default: Date.now},
        updated_at: {type: Date, index: {unique: false}, default: Date.now}
        // 인덱싱이 너무 많으면 오히려 느려지기 때문에 날짜는 false로 처리한다.
    });

    // password를 virtual 메소드로 정의 -> 몽고디비에 저장되지 않는 가상 속성입니다.
    // 특정 속성을 지정하고 get, set 메소드를 정의합니다.
    UserSchema.virtual('password').set(function(password) {
        this._password = password;
        this.salt = this.makeSalt(); // 특정 키값을 발생시켜 넣어줌
        this.hashed_password = this.encryptPassword(password); // 암호화를 시켜 넣어줌
        console.log('virtual password의 set 호출 : ' + this.hashed_password);
    }).get(function(){
        console.log('virtual password의 get 호출');
        return this._password;
    });

    // 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
    // 비밀번호 암호화 메소드
    UserSchema.method('encryptPassword', function(plainText, inSalt) { // 입력한 값, db에 값
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex'); // sha1 : 단반향 , 다시 복호화불가능
        }else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    // salt 값 만들기 메소드
    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''; // 자연수가 만들어진다.
    });

    // 인증 메소드 - 입렫된 비밀번호화 비교 (true/false 리턴)
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
        if(inSalt){
            console.log('authenticate 호출 : ' + plainText + ', ' + inSalt + ', ' + hashed_password);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }else{
            console.log('authenticate 호출 : ' + plainText + ', ' + inSalt + ', ' + hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password; 
        }
    });

    let validatePresenceOf = function(value){ // this.password를 value에 넣어주면 이라는 뜻
        return value && value.length; // 데이터가 있는지 없는지 여부, 
    }

    // 회원가입시 트리거 함수를 정의(password 필드가 유효하지 않으면 에러 발생)
    UserSchema.pre('save', function(next){ // pre : save가 실행되기 전에 이 트리거가 실행되라
        if(!this.isNew) return next(); // 새로운 데이터가 들어오지 않았다면
        if(!validatePresenceOf(this.password)){ 
            next(new Error('유효하지 않은 passwrod필드입니다.'));
        }else{
            next();
        }
    });
    
    UserSchema.path('userid').validate(function (userid) {
        return userid.length;
    }, 'userid 값이 없습니다.');

    UserSchema.path('name').validate(function (name) {
        return name.length;
    }, 'name 값이 없습니다.');

    UserSchema.path('hashed_password').validate(function (hashed_password) {
        return hashed_password.length;
    }, 'hashed_password 값이 없습니다.');

    UserSchema.static('findById', function(userId, callback) {
        return this.find({userid:userId}, callback);
    });

    UserSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });

    console.log('userSchema 정의됨');

    UserModel = mongoose.model('users2', UserSchema);
    console.log('users2 정의됨');
}

let router = express.Router();

router.route('/member/login').post((req, res) => {
    let userId = req.body.userid || req.query.userid;
    let userPw = req.body.password || req.query.password;
    
    console.log('요청 파라미터 : ' + userId + ', ' + userPw);

    if(database){
        loginMember(database, userId, userPw, (err, docs) => {
            if(err) { console.log(err); }
            if(docs) { 
                console.dir(docs);
                let username = docs[0].name;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공!</h2>');
                res.write('<p>아이디 : ' + userId + '</p>');
                res.write('<p>비밀번호 : ' + userPw + '</p>');
                res.write('<p>이름 : ' + username + '</p>');
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
    let userPw = req.body.password;
    let Name = req.body.name;

    console.log('요청 파라미터 : ' + userId + ', ' + userPw + ', ' + Name);
    if(database){
        addMember(database, userId, userPw, Name, (err, result) => {
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
                    res.write("<li>" + i + " : " + userId + ", " + Name + "</li>");
                }
                res.write('</ul></div>');
                res.end();
            }else{
                console.log('데이터 없음');
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

    UserModel.findById(userId, (err, result) => {
        if(err){
            callback(err, null);
            return;
        }
        console.log('아이디 [%s]로 사용자 검색결과', userId);
        console.dir(result);

        if(result.length > 0){
            console.log('아이디와 일치하는 사용자 찾음');
            // 비밀번호 확인 : 모델 인스턴스의 객체를 만들고 authenticate() 메소드 호출
            let member = new UserModel({userid:userId});
            let authenticated = member.authenticate(userPw, result[0]._doc.salt, result[0]._doc.hashed_password); 
            if(authenticated){
                console.log('비밀번호 일치');
                callback(null, result);
            }else{
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        }else{
            console.log('아이디와 일치하는 사용자를 찾지 못함');
            callback(null, null);
        }
    });
}

let addMember = function(database, userId, userPw, Name, callback){
    console.log('addMember 호출!');
    let members = new UserModel({userid:userId, password:userPw, name:Name});

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
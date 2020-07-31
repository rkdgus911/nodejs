// npm install nodemailer
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static'); // 특정 파일 위치
const fs = require('fs');
// npm install multer
const multer = require('multer'); // 첨부파일
const path = require('path');
// npm install morgan // router 어느 부분이 현재 작동하는지, 시간은 얼마나 걸리고 데이터 얼마나 사용하는지 확인
const logger = require('morgan');
let MongoClient = require('mongodb').MongoClient;
let app = express();
let port = 3000;
let database;

app.use('/uploads',static(path.join(__dirname,'uploads')));
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));

app.use(logger('dev')); // dev, short, common, combines 네 개를 사용

let storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null, 'uploads');
    },
    filename: (req,file,callback)=>{
        let extenstion = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extenstion);
        callback(null, basename +'_'+ Date.now() + extenstion);
    }
});

let upload = multer({
    storage: storage,
    limits: { //저장할수 있는 최대크기
        files:5,    // 총 5개 데이터 넣어줄 수 있게
        fileSize:1024*1024*1024
    }
});

let router = express.Router();

router.route('/signup').get((req, res) => {
    fs.readFile('./public/signup.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

app.get('/login', (req, res) => {
    let userId = req.query.userid;
    let userPw = req.query.userpw;
    let userName = req.query.name;
    let userEmail = req.query.email;

    if(req.session.member){
        res.redirect('/main');
    }else{
        req.session.member = {
            userid: userId,
            username: userName,
            email: userEmail,
            isAuth: ture 
        };
    }
});

app.get('/delete', (req, res) => {
    let userId = req.query.userid;
    let userName = req.query.name;
    let userEmail = req.query.email;

    if(req.session.member){
        res.redirect('/main');
    }else{
        req.session.member = {
            userid: userId,
            username: userName,
            email: userEmail,
            isAuth: ture 
        };
    }
});

router.route('/login').get((req, res) => {
    fs.readFile('./public/login.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});


router.route('/loginOk').post((req, res) => {
    console.log('/login 호출');
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
                res.write('<button><a href="./public/resign.html">회원정보수정</a></button>&nbsp;&nbsp;<button><a href="./public/delete.html">회원탈퇴</a></button>');
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

router.route('/signupOk').post(upload.array('photo',1),((req, res) => {
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let userName = req.body.name;
    let userEmail = req.body.email;

    console.log('요청 파라미터 : ' + userId + ", " + userPw + ", " + userName + ", " + userEmail);
    if(database){
        addMember(database, userId, userPw, userName, userEmail, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result.insertedCount > 0){
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공!</h2>');
                res.write('<p>회원가입이 성공적으로 되었습니다.</p>');
                res.write('<p>' + userId + '</p>');
                res.write('<p>' + userName + '</p>');
                res.write('<p>' + userEmail + '</p>');
                res.write('<a href="./public/login.html">로그인으루</a>');
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
}));

router.route('/deleteOk').post((req, res) => {
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let userName = req.body.name;
    let userEmail = req.body.email;

    if(database){
        deleteMember(database, userId, userPw, userName, userEmail, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result.modifiedCount > 0){
                console.dir(result); // 객체에 뭐가 들어있나 확인
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원탈퇴 성공!</h2>');
                res.write('<p>회원탈퇴에 성공했습니다.</p>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원탈퇴 실패!</h2>');
                res.write('<p>회원탈퇴에 실패했습니다.</p>');
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

router.route('/resignOk').post(upload.array('photo',1),((req, res) => {
    console.log('/resignOk 호출');
    let userId = req.body.userid;
    let userPw = req.body.userpw;
    let userName = req.body.name;
    let userEmail = req.body.email;

    console.log('요청 파라미터 : ' + userId + ", " + userPw + ", " + userName + ", " + userEmail);
    
    if(database){   // err, result 가 만들어지는 콜백 호출
        editMember(database, userId, userPw, userName, userEmail, (err, result) => {
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
}));

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

let addMember = function(database, userId, userPw, userName, userEmail, callback){
    console.log('addMember 호출');
    let members = database.collection('member');

    members.insertMany([{userid:userId, pass:userPw, name:userName, email:userEmail}], (err, result) => { // (err, result) 콜백
        console.log(userId)
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

let editMember = function(database, userId, userPw, userName, userEmail, callback){
    console.log('editMember 호출');
    let members = database.collection('member'); // member 컬렉션을 가져옴
    members.updateOne({userid:userId}, {$set:{userid:userId, pass:userPw, name:userName, email:userEmail}}, (err, result) => {
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

let deleteMember = function(database, userId, callback){
    let members = database.collection('member');
    members.deleteOnd({userid:userId}, {$unset:{score:1}} , (err, result) => {
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

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'rkdgus911@gmail.com', // 자기 이메일
        pass: '@kbkb082323'         
    },
    host: 'smpt.gmail.com',
    port: '465'
});

router.route('/signupOk').post(upload.array('photo',1),(req,res)=>{  // 1 : 파일 들어가는 갯수
    console.log('/signup 호출');
    try{
        let files = req.files;
        console.dir(req.files[0]);

        let originalname ='';
        let filename ='';
        let mimetype = '';
        let size = 0;
        let id = req.body.userid;
        let email = req.body.email;

        if(Array.isArray(files)){ 
            console.log("클라이언트에서 받아온 파일 개수 : %d",files.length);

            for(let index=0; index<files.length; index++){ //배열
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        }else{//배열로 들어오지 않고 한개인경우
            console.log("클라이언트에서 받아온 파일 개수 : 1");
            originalname = files[0].originalname;
            filename = files[0].filename;
            mimetype = files[0].mimetype;
            size = files[0].size;
        }

        fs.readFile('uploads/' + filename, (err, data) => {
            if(err){
                console.log(err);
            }
            let mailOptions = {
                from: "김강현 <rkdgus911@gmail.com>",
                to: email,
                subject: id,
                text: '로그인 코드 : 1234',
                attachments: [{'filename': filename, 'content': data}]
            };
        
            transporter.sendMail(mailOptions, (err,info) =>{
                transporter.close();
                if(err){
                    console.log(err);
                }else{
                    console.log(info);
                }
            });
        });

        console.log('현재 파일 정보 : ' +originalname+','+filename+','+mimetype+','+size);

        res.writeHead('200',{'Content-Type' : 'text/html; charset=utf8'});
        res.write('<h2>회원가입</h2>');
        res.write('<hr>');
        res.write('<p>아이디 : ' + userid + '</p>');
        res.write('<p>이메일 : ' + email + '</p>');
        res.write('<p>이름 : ' + name +'</p>');
        res.write("<p><img src='/uploads/" + filename + "' width=200></p>");
        res.end();

    }catch(e){
        console.log(e);
    }
});

app.use('/', router);

app.listen(port,()=>{
    console.log('Server listening on port : ' +port);
    connectDB();
});




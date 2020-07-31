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

let app = express();
let port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use('/uploads',static(path.join(__dirname,'uploads')));
app.use('/public',static(path.join(__dirname,'public')));
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

var router = express.Router();

app.get('/mail', (req, res) => {
    fs.readFile('./public/mail.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'rkdgus911@gmail.com', // 자기 이메일
        pass: '@kbkb082323'         
    },
    host: 'smpt.gmail.com',
    port: '465'
});

router.route('/board/mail').post(upload.array('photo',1),(req,res)=>{  // 1 : 파일 들어가는 갯수
    console.log('/board/mail 호출');
    try{
        let files = req.files;
        console.dir(req.files[0]);

        let originalname ='';
        let filename ='';
        let mimetype = '';
        let size = 0;
        let id = req.body.userid;
        let email = req.body.email;
        let title = req.body.title;
        let content = req.body.content;

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
                subject: title,
                text: content,
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
        res.write('<h2>글작성</h2>');
        res.write('<hr>');
        res.write('<p>아이디 : ' + id + '</p>');
        res.write('<p>이메일 : ' + email + '</p>');
        res.write('<p>제목 : ' + title +'</p>');
        res.write('<p>내용 : ' + content +'</p>');
        res.write("<p><img src='/uploads/" + filename + "' width=200></p>");
        res.end();

    }catch(e){
        console.log(e);
    }
});

app.use('/', router);

app.listen(port,()=>{
    console.log('Server listening on port : ' +port);
});




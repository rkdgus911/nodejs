const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const fs = require('fs');
// npm install multer
const multer = require('multer');
const path = require('path');

let app = express();
let port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use('/uploads',static(path.join(__dirname,'uploads')));
app.use('/public',static(path.join(__dirname,'public')));

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
        files:5,
        fileSize:1024*1024*1024
    }
});

var router = express.Router();

// upload.single() 한개의 데이터만 받는다.
router.route('/board/write').post(upload.array('photo',1),(req,res)=>{  // 1 : 파일 들어가는 갯수
    console.log('/board/write 호출');
    try{
        let files = req.files;
        console.dir(req.files[0]);

        let originalname ='';
        let filename ='';
        let mimetype = '';
        let size = 0;

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
        
        let title = req.body.title;

        console.log('현재 파일 정보 : ' +originalname+','+filename+','+mimetype+','+size);

        res.writeHead('200',{'Content-Type' : 'text/html; charset=utf8'});
        res.write('<h2>파일 업로드 성공</h2>');
        res.write('<hr>');
        res.write('<p>제목 : ' + title + '</p>');
        res.write('<p>현재 파일명 : ' + originalname +' ->저장 파일명 : ' + filename +'</p>');
        res.write('<p>Mime Type : ' + mimetype +'</p>');
        res.write('<p>파일크기 : ' + size +'</p>');
        res.write("<p><img src='/uploads/" + filename + "' width=200></p>");
        res.end();

    }catch(e){
        console.log(e);
    }
});

app.use('/',router);

app.listen(port,()=>{
    console.log('Server listening on port : ' +port);
});
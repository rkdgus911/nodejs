// npm install nodemailer
const nodemailer = require('nodemailer');
const fs = require('fs');
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'rkdgus911@gmail.com', // 자기 이메일
        pass: '@kbkb082323'         
    },
   host: 'smpt.gmail.com',
   port: '465'
});

fs.readFile('./test.txt', (err, data) => {
    let mailOptions = {
        from: "김강현 <rkdgus911@gmail.com>",
        to: "me1995911@naver.com",
        subject: "node.js mailer 파일첨부 테스트중입니다.",
        text: "안녕하세요. 메일이 잘 전달되나요???",
        attachments: [{'filename':'test.txt', 'content': data}]
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
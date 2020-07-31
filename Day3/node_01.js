// npm install nodemailer
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'rkdgus911@gmail.com', // 자기 이메일
        pass: '@kbkb082323'         
    },
   host: 'smpt.gmail.com',
   port: '465'
});

let mailOptions = {
    from: "김강현 <rkdgus911@gmail.com>",
    to: "me1995911@naver.com",
    subject: "node.js mailer 테스트중입니다.",
    //text: "안녕하세요. 메일이 잘 전달되나요?"
    html : "<h2>안녕하세요. 잘전달되나요???</h2><p>반갑습니다.</p>"
};

transporter.sendMail(mailOptions, (err,info) =>{
    transporter.close();
    if(err){
        console.log(err);
    }else{
        console.log(info);
    }
});
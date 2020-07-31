const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    fs.readFile('mail.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'content-Type':'text/html'});
        res.end(data);
    });
});

app.post('/mailOk', (req, res) => {
    console.log(req.body);
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
        to: req.body.to,
        subject: req.body.title,
        text: req.body.content
    };
    
    transporter.sendMail(mailOptions, (err,info) =>{
        transporter.close();
        if(err){
            console.log(err);
        }else{
            console.log("메일이 정상적으로 발송되었습니다.");
        }
    });
});

app.listen(port, () => {
    console.log('Server listening on port : ' + port);
});


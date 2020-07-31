const { response } = require("express");

module.exports = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            title: '안녕하세요. node.js',
            length: 10
        });
    });
    app.get('/about', (req, res) => {
        res.render('about.html');
    });
    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            console.log(data);
            res.writeHead(200, {'Content-Type':'text/json;charset=utf-8'});
            res.end(data);
        });
    });
    app.get('/getMember/:userid', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            let members = JSON.parse(data);
            res.json(members[req.params.userid]);
        }); 
    });
    app.post('/joinMember/:userid', (req, res) => {
        let result = {};
        let userid = req.params.userid; // URL로 딸려오는 건 GET 방식이다.
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            let members = JSON.parse(data); // 제이슨형태로 넣어줌
            if(members[userid]){
                result["success"] = 100;
                result["msg"] = "duplicate";
                res.json(result);
                return false;
            }
            console.log(req.body);
            members[userid] = req.body;
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(members, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        }); 
    });
    /*
        put : 식별자가 없을 경우 post와 동일하게 사용되나, 식별자가 있을 경우 해당 식별자의 데이터를 변경할 때 사용하도록 권장합니다.
    */
    app.put('/updateMember/:userid', (req, res) => {
        let result = {};
        let userid = req.params.userid;
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            console.log(data);
            let members = JSON.parse(data);
            members[userid] = req.body;
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(members, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });
    app.delete('/delMember/:userid', (req, res) => {
        let result = {};
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            console.log(data);
            let members = JSON.parse(data);
            if(!members[req.params.userid]){
                result["success"] = 100;
                result["msg"] = "not found";
                res.json(result);
                return false;
            }
            delete members[req.params.userid];
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(members, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });

}
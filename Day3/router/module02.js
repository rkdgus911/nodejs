const { response } = require("express")

module.exports = (app, fs) => {
    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/list.json", "utf8", (err, data) => {
            console.log(data);
            res.writeHead(200, {'Content-Type':'text/json; charset=utf-8'});
            res.end(data);
        });
    });
    app.get('/getList/:userid', (req, res) => {
        fs.readFile(__dirname + "/../data/list.json", "utf8", (err, data) => {
            let lists = JSON.parse(data);
            res.json(lists[req.params.userid]);
        }); 
    });
    app.post('/joinList/:userid', (req, res) => {
        let result = {};
        let userid = req.params.userid;
        if(!req.body["title"] || !req.body["content"] || !req.body["hit"] || !req.body["date"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/list.json", "utf8", (err, data) => {
            let lists = JSON.parse(data);
            if(lists[userid]){
                result["success"] = 100;
                result["msg"] = "duplicate";
                res.json(result);
                return false;
            }
            console.log(req.body);
            lists[userid] = req.body;
            fs.writeFile(__dirname + "/../data/list.json", JSON.stringify(lists, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });
    app.put('/updateList/:userid', (req, res) => {
        let result = {};
        let userid = req.params.userid;
        if(!req.body["title"] || !req.body["content"] || !req.body["hit"] || !req.body["date"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/list.json", "utf8", (err, data) => {
            console.log(data);
            let lists = JSON.parse(data);
            lists[userid] = req.body;
            fs.writeFile(__dirname + "/../data/list.json", JSON.stringify(lists, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });
    app.delete('/delList/:userid', (req, res) => {
        let result = {};
        fs.readFile(__dirname + "/../data/list.json", "utf8", (err, data) => {
            console.log(data);
            let lists = JSON.parse(data);
            if(!lists[req.params.userid]){
                result["success"] = 100;
                result["msg"] = "not found";
                res.json(result);
                return false;
            }
            delete lists[req.params.userid];
            fs.writeFile(__dirname + "/../data/list.json", JSON.stringify(lists, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });
}
let express = require('express');
let fs = require('fs');
let bodyParser = require('body-parser');
let app = express();
let port = 3000;

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded());

let module02 = require('./router/module02')(app, fs);

app.listen(port, () => {
    console.log('Server listening on port : ' + port);
});
let fs = require('fs');
let text = fs.readFileSync("text1.txt", "utf-8");
console.log(text);

fs.readFile("text1.txt", "utf-8", function(err, data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
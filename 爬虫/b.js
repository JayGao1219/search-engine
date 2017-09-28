var http = require("https");
var fs = require("fs");

var server = http.createServer(function(req, res){}).listen(50082);
console.log("http start");

 

var url = "https://upload.wikimedia.org/wikipedia/en/2/21/Karen_Aabye.jpg";
http.get(url, function(res){
    var imgData = "";

    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


    res.on("data", function(chunk){
        imgData+=chunk;
    });

    res.on("end", function(){
        fs.writeFile("./3/test.jpg", imgData, "binary", function(err){
            if(err){
                console.log("down fail");
            }
            console.log("down success");
        });
    });
});

/**
 * test
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();
var path = require("path");
var fs = require("fs");

app.use(static(__dirname+"/public"));
app.use(simply.post)
app.use(simply.redirect)
app.use(simply.download)
app.use(simply.view(__dirname+"/views"));

app.post("/upload", function(req, res) {
	res.view("test.html")
	//var buffer = new Buffer("hehehe");
	//res.download("o.exe",buffer);
	//res.redirect("http://www.baidu.com")
    /*var ext = path.extname(req.fields["fileName"]);
    fs.writeFile("./"+new Date().getTime()+ext, req.fields["file"], function (err) {
          if (err) throw err;
          res.end("success!")
    });*/
})
app.listen(3000)

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

app.post("/upload", function(req, res) {
    var ext = path.extname(req.files["fileName"]);
    fs.writeFile("./"+req.files["fileName"], req.files["file"], function (err) {
          if (err) throw err;
          res.end("success!")
    });
})
app.listen(3000)

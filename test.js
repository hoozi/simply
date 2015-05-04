/**
 * test
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();

app.use(static(__dirname+"/public"));

app.get("/", function(req, res) {
    res.write("/");
    res.end();
})
app.get("/about1", function(req, res) {
    res.write("hl1");
    res.end();
})
app.get("/about2", function(req, res) {
    res.write("hl2");
    res.end();
})
app.listen(3000)

/**
 * test
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();

//app.use(static(__dirname+"/public"));

app.get("/", function(req, res) {
    res.write("/");
    res.end();
})
app.get("/about2/:aa/b", function(req, res) {
    res.write("hl2");
    res.end();
})
console.log(app._route_getHandles)
app.listen(3000)

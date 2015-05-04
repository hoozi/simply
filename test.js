/**
 * @author Administrator
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();

app.use(static(__dirname+"/public"));
app.use(static(__dirname));
app.get(function(req, res) {
    res.write("get!");
    res.end();
})
app.post(function(req, res) {
    res.write("post!");
    res.end();
})
app.listen(3000)

/**
 * test
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();

app.use(simply.query);

app.get("/name", function(req, res) {
    res.write("query:"+req.queryObj.name+";"+req.queryObj.age);
    res.end();
})
app.get("/about2/:name/:age", function(req, res) {
    res.write("name:"+req.params["name"]+";age:"+req.params["age"]);
    res.end();
})
app.listen(3000)

/**
 * @author Administrator
 */

var simply = require("./simply");
var static = simply.static;
var app = new simply.App();

app.use(static(__dirname+"/public"));
app.listen(3000)

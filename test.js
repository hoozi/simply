/**
 * test
 */

var simply = require("./simply"),
    static = simply.static,
    app = new simply.App();

app.use(static(__dirname+"/public"));
app.use(simply.post)

app.post("/upload", function(req, res) {
    /*res.write(req.body.name);
    res.end();*/
   
   var body = "";
   req.on("data", function(data){
       body+=data;
   })
   req.on("end", function(){
       console.log(body)
   })
})
app.listen(3000)

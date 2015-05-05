/**
 * @build: 2015-05-05
 * @NAME : post
 */
var qs = require("querystring");
module.exports = function(req, res, next){
    var body = "";
    req.on("data", function(data) {
        body+=data;
    })
    req.on("end", function() {
        
        var contentType = req.headers["content-type"],
        
        //判断是否有enctype="multipart/form-data"（是否是文件上传）
            isMulti = /(boundary=)/gi.test(contentType)

        if(isMulti){
            
            //获取边界字符串
            var boundary = RegExp["$'"],
            
            //获得截取开始位置    
                boundaryStandard = "--"+boundary+"\r\n",
                
            //获取截取结束位置
                boundaryEnd = boundaryStandard+"--",
                
            //body信息去头去尾
                body = body.substring(boundaryStandard.length, body.length-boundaryEnd),
            
            //根据边界字符串进行分隔
                fields = body.split(boundary);
            
        } else {
            try{
                req.body = qs.parse(body)
            }catch(e){}
        }
        next();
    })
}

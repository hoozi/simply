/**
 * @build: 2015-05-05
 * @NAME : post
 */
module.exports = function(req, res, next){
    
    var body = "",
        contentType = req.headers["content-type"],
        
        //判断是否有enctype="multipart/form-data"
        isMulti = /(boundary=)/gi.test(contentType);
        
        //已键值对的形式储存字段值
        req.files = {};
        req.body = {}
        
    req.on("data", function(data) {
        body+=data;
    })
    req.on("end", function() {
       if(isMulti){
                //获取边界字符串
            var boundary = RegExp["$'"],
                
                //获得截取开始位置    
                boundaryStandard = "--"+boundary+"\r\n",
                    
                //获取截取结束位置
                boundaryEnd = "--"+boundary+"--\r\n";
                    
                //body信息去头去尾
                body = body.substring(boundaryStandard.length, body.length-boundaryEnd.length),
                
                //根据边界字符串进行分隔
                fields = body.split(boundaryStandard),
         
                //换行符
                RN = "\r\n\r\n";
            fields.forEach(function(field){
 
                   //获取头信息结束位置
                   var headerEnd = field.indexOf(RN),
                   
                       //截取获得头信息
                       header = field.substring(0, headerEnd);
                   
                   //检测header是否有name="xxxx"
                   /name=\"(.*?)\"/gi.test(header);
                    
                   //获得字段的name
                   var fieldName = RegExp["$1"],
                   
                        //检测是否是文件
                        isFile = /filename/gi.test(header),
                   
                        //获得主体内容（值）
                        body = field.substring(headerEnd+RN.length),
                        content = body.substring(0, body.length-RN.length/2);
                        
                   if(isFile) {
                       /filename=\"(.*?)\"/gi.test(header);
                       req.files[fieldName] = new Buffer(content);
                       req.files["fileName"] = RegExp["$1"];
                   } else {
                       req.body[fieldName] = content;
                   }
                   
            })
            
        } else {
            try{
                var qs = require("querystring");
                req.body = qs.parse(body)
            }catch(e){}
        }
        next();
    })
}

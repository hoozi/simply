/**
 * @build: 2015-05-05
 * @NAME : post
 */
var fs = require("fs");
var Q = require("Q");

module.exports = function(req, res, next){
    
    var body_str = "",
        contentType = req.headers["content-type"],
        contentLength = req.headers["content-length"],
        //判断是否有enctype="multipart/form-data"
        isMulti = /(boundary=)/gi.test(contentType),
        
        //获取边界字符串
        boundary = RegExp["$'"],
        
        //获得截取开始位置    
        boundaryStandard = "--"+boundary+"\r\n",
        
        //获取截取结束位置
        boundaryEnd = "--"+boundary+"--\r\n",
        
        RN = "\r\n\r\n";
        
    //已键值对的形式储存字段值
    req.files = {};
    req.body = {};
    
    var reqWrite = fs.createWriteStream(__dirname+"/temp");
    req.pipe(reqWrite);
    
    var exists = function(path) {
        var deferred = Q.defer()
        fs.exists(path, function(exists) {
            if(exists) {
                deferred.resolve(path);
            } else {
                deferred.reject("找不到文件");
            }
        })
        return deferred.promise;
    }
    var openFile = function(path) {
        var deferred = Q.defer()
        fs.open(path, "r", function(err, fd) {
            if(err) {
                deferred.reject(err)
            } else {
                deferred.resolve(fd);
            }
        })
        return deferred.promise;
    }
    var readFile = function(fd) {
        var deferred = Q.defer();
        var buf = new Buffer(parseInt(contentLength,10));
        buf.fill(0);
        fs.read(fd, buf, 0, buf.length, 0, function(err, bytesRead, buffer) {
            //console.log(bytesRead) 
            if(err) {
                deferred.reject(err)
            } else {
                deferred.resolve(buffer);
            }
        })
        return deferred.promise;
    }
    exists(__dirname+"/temp")
        .then(openFile,function(err) {
            throw err;  
        })
        .then(readFile,function(err) {
            throw err;  
        })
        .done(function(buffer){
           //解析buffer
           if(isMulti){
               //储存备份数据
               var backup = [],
               
                   //储存数据体
                   body = [],
                   
                   /* 读取状态
                    * 0:表示怀疑边界字符串
                    * 1：表示正在读取头信息
                    * 2：表示正在读取数据体
                    * */
                   readFlag = 0,
                   
                   //读取开始位置
                   read = 0;
                   
               function handle(bt) {
                   switch(readFlag) {
                       case 0:
                            if(body_data.slice(read,read+boundaryStandard.length).toString()===boundaryStandard) {
                                if(backup.length>0) {
                                   body.push(backup);
                                   backup = []; 
                                } else {
                                    read+=boundaryStandard.length;
                                    readFlag = 1;
                                }
                            } else if(body_data.slice(read, read+boundaryEnd.length).toString()===boundaryEnd) {
                                if(backup.length>0) {
                                    body.push(backup);
                                }
                                return true //表示已经读取完毕
                            } else {
                                backup.push(bt);
                                read+=1;
                            }
                       break;
                       case 1:
                            if(backup.length>=3) {
                                var last3 = backup.slice(backup.length-3,backup.length);
                                last3.push(bt);
                                backup.push(bt);
                                if(new Buffer(last3).toString()==="\r\n\r\n") {
                                    body.push(backup);
                                    backup = [];
                                    readFlag = 2;
                                }
                            } else {
                                backup.push(bt);
                            }
                            read+=1    
                       break;
                       case 2:
                            backup.push(bt);
                            read+=1;
                       break;
                   }
               }           
               
               for(var len = body_data.length;read<len;) {
                   var bt = body_data[read];
                   
                   if(readFlag===0 || readFlag===2) {
                       if(bt===45) {
                           readFlag = 0
                       } else {
                           readFlag = 2;
                       }
                   }
                   
                   var end = handle(bt);
                   //是否已经读完
                   if(end) {
                       for(var i=0, len=body.length;i<len;) {
                           var header = new Buffer(body[i]).toString(),
                               arr = body[i+1],
                               data = new Buffer(arr.slice(0,arr.length-2));
                           //检测header是否有name="xxxx"
                           /name=\"(.*?)\"/gi.test(header);
                            
                           //获得字段的name
                           var fieldName = RegExp["$1"],
                               isFile = /filename/gi.test(header);
                           
                           if(isFile) {
                               /filename=\"(.*?)\"/gi.test(header);
                               req.files[fieldName] = data;
                               req.files["fileName"] = RegExp["$1"];
                           } else {
                               req.body[fieldName] = data.toString();
                           }
                           i+=2;
                       }
                       break;
                   }
               }
                
            } else {
                try{
                    var qs = require("querystring");
                    req.body = qs.parse(body)
                }catch(e){}
            }
            next();
        })
    
}

/**
 * @build: 2015-05-08
 * @NAME : mypost
 */
var fs = require("fs");
module.exports = function(req, res, next){

	var contentType = req.headers["content-type"],
		contentLength = parseInt(req.headers["content-length"], 10),
		multipart = /(boundary=)/i.test(contentType),

		//获取边界字符
		boundary = RegExp["$'"],

		//边界字符基准
		boundaryFlag = "--"+boundary+"\r\n",

		//边界字符末尾
		boundaryEnd = "--"+boundary+"--\r\n",

		streamDir = __dirname+"/tmp",
		reqWrite = fs.createWriteStream(streamDir);

	req.pipe(reqWrite);

	//保存字段	
	req.fields = {};
	req.body = {};

	//打开
	fs.open(streamDir, "r", function(err, fd) {
		if(err) throw err
		var buf = new Buffer(contentLength);
		buf.fill(0);

		//读取
		fs.read(fd, buf, 0, buf.length, 0, function(err, readLength, buffer) {
			if(err) throw err;

			//解析buffer,套用原来的post二进制解析
			if(multipart){
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
		                        if(buffer.slice(read,read+boundaryFlag.length).toString()===boundaryFlag) {
		                            if(backup.length>0) {
		                               body.push(backup);
		                               backup = []; 
		                            } else {
		                                read+=boundaryFlag.length;
		                                readFlag = 1;
		                            }
		                        } else if(buffer.slice(read, read+boundaryEnd.length).toString()===boundaryEnd) {
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
		           
		           for(var len = buffer.length;read<len;) {
		               var bt = buffer[read];
		               
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
		                           req.fields[fieldName] = data;
		                           req.fields["fileName"] = RegExp["$1"];
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
		                req.body = qs.parse(buffer.toString())
		            }catch(e){}
		        }
		        next();

		})
		
		
	})
}
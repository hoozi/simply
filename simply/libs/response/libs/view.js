/**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi 
 * @email   : 287036406@qq.com
 * @date    : 2015-05-08 14:04:20
 * @version : 0.0.1
 */
var fs = require("fs"),
	path = require("path");

//过滤\r\n
function filter(str) {
	//对\'、\r、\n进行转义
	var str = str.replace("\'", "\\'")
				 .replace(/\r/g, "\\r")
				 .replace(/\n/g, "\\n");
	return "result+= \'"+str+"\';\r\n";
}

module.exports = function(viewPath) {
	//用来缓存视图
	var viewCache = {};
	fs.readdir(viewPath, function(err, files) {
		files.forEach(function(file) {
			fs.readFile(path.join(viewPath,file), function(err, buffer) {
				if(err) throw err;
				var template = buffer.toString();
				var buf = [];
				buf.push("var result = '';");
				var htmlPart = "";
				for(var i=0,len=template.length;i<len;) {
					if(template.slice(i, i+2) === "<%") {
						var end = template.indexOf("%>", i);
						var jsPart = template.slice(i+2, end);

						//跳过js段
						i=end+2;

						//push到buf数组，并且清空
						buf.push(filter(htmlPart));
						htmlPart = "";

						if(jsPart.slice(0,1)==="=") {
							buf.push("\r\nresult+="+jsPart.slice(1)+";\r\n");
						} else {
							buf.push("\r\n"+jsPart+"\r\n");
						}

					} else {
						htmlPart+=template.slice(i,i+1);
						i+=1
					}

				}
				buf.push(filter(htmlPart));
				buf.push("return result");
				viewCache[file] = new Function("data",buf.join(""));
			})
		})
	})

	return function(req, res, next) {
		res.view = function(viewName, data){
			
			res.write(viewCache[viewName](data));
			res.end();
		}
		next();
	}
}
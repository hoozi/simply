/**
 * 静态文件
 */
var fs = require("fs");
var url = require("url");

/*
 * 获取url转换成资源路径
 * */
function urlToPath(str_url) {
    return url.parse(str_url).path
}

module.exports = function(parent_path) {
    return function(req, res, next) {
        if(req.url!=="/favicon.ico") {
            var path = urlToPath(req.url);
            fs.readFile(parent_path+path, function(err, data) {
                if(err) {
                    //res.statusCode = 404;
                    //如果错误，直接next;
                    next();
                } else {
                    res.write(data)
                    res.end();
                }
            })
        }
        //next();
    }
}

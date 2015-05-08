/**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi 
 * @email   : 287036406@qq.com
 * @date    : 2015-05-08 13:27:54
 * @version : 0.0.1
 */
module.exports = function(req, res, next){
	res.redirect = function(url) {
		res.writeHead(302, {
			"Location": location(req, url)
		});
		res.end();
	}
	next();
}

var location = function(req, url) {
	if(/^http:\/\//.test(url)) { //远程http地址
		return url;
	} else if(/^\//.test(url)) { //本地地址
		return "http://"+req.headers.host+url;
	} else { //其他情况
		return "http://"+req.headers.host+req.url+"/"+url;
	}
}
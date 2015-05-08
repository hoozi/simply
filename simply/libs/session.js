 /**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi
 * @email   : 287036406@qq.com
 * @date    : 2015-05-08 20:30:45
 * @version : 0.0.1
 */

var now = Date.now(), cache = {};

module.exports = function(req, res, next) {
	Object.defineProperty(req, "session", {
		get:function(){
			return cache[this.sessionId];
		},
		set:function(value){
			cache[this.sessionId]=value;
		}
	})
	if(!(req.headers.cookie&&(req.sessionId = parseSession(req.headers.cookie).sessionId))){
		req.sessionId = now+=1;
		res.setHeader("Set-Cookie",["sessionId="+req.sessionId]);
	}
	next()
}

var parseSession = function(str) {
	var arr = str.split(";"),
		obj = {};
	arr.forEach(function(item) {
		var o = item.split("=");
		obj[o[0].trim()] = o[1];
	})	
	return obj;
}
/**
 * @name    text
 * @authors 287036406@qq.com
 * @date    2015-05-08 12:43:16
 * @version 0.0.1
 */
module.exports = function(req, res, next) {
	res.txt = function(text) {
		res.writeHead(200, {
			"Content-Type":"text/plain",
			"Content-Length":Buffer.byteLength(text)
		})
		res.write(text);
		res.end();
	}
	next();
}

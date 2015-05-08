/**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi 
 * @email   : 287036406@qq.com
 * @date    : 2015-05-08 13:46:14
 * @version : 0.0.1
 */

module.exports = function(req, res, next) {
	res.download = function(fileName, buffer) {
		if(Buffer.isBuffer(buffer)) {
			res.writeHead(200, {
				// 设置下载文件名称
                'Content-disposition': 'attachment; filename=' + fileName,
                // 保证是二进制类型，这样浏览器可用下载方式
                'Content-Type': 'application/octet-stream',
                // 设置buf大小
                'Content-Length': buffer.length
			})
			res.write(buffer);
			res.end();
		} else {
			res.end();
		}
	}
	next();
}
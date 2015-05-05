/**
 * @build: 2015-05-05
 * @NAME : query
 */
var url = require("url"),
    qs = require("querystring");

function query(req, res, next){
    var querystring = url.parse(req.url).query;
    
    if(querystring) {
        var queryObj = qs.parse(querystring);
        req.queryObj = queryObj
    }
    next()
}

module.exports = query
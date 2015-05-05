/**
 * pathRegExp
 */
//var path = require("path");

module.exports = function(path){
    
    //用于储存参数名称
    var paramNames = [],
        path = path
    
               //替换(*)
               .replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g, "([0-9A-Za-z\-_]*)")
                   
               //替换(:xxx)形式
               .replace(/(:(.*?(?=\/)))|(:(.*?(?=$)))/g, "([0-9A-Za-z\-_]*)")
                   
               //替换 (xxx/:id/)为(xxx/:id)
               .replace(/\/$/g,"")
                   
               //替换/为\/
               .replace(/\//g, "\\\/");
               
    var reg = new RegExp("^"+path+"\\/?$");
    reg.paramNames = paramNames;
    return reg;               
    
}

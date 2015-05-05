/**
 * pathRegExp
 */

module.exports = function(path){
    
    //用于储存参数名称
    var paramNames = [],
        path = path
    
               //替换(*)
               .replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g, "[0-9A-Za-z\-_]*")
                   
               //替换(:xxx)形式
               .replace(/(:(.*?(?=\/)))|(:(.*?(?=$)))/g, function(){
                   
                   //匹配$1....$n
                   var args = arguments;
                   for(var i=0, len=args.length-3; i<len; i++) {
                       var arg = args[i+1];
                       if(typeof arg=="string" && arg[0]!=":") {
                           paramNames.push(arg);
                       }
                   }
                   
                   return "([0-9A-Za-z\-_]*)";
               })
                   
               //替换 (xxx/:id/)为(xxx/:id)
               .replace(/\/$/g,"")
                   
               //替换/为\/
               .replace(/\//g, "\\\/");
               
    var reg = new RegExp("^"+path+"\\/?$");
    reg.paramNames = paramNames;
    return reg;               
    
}

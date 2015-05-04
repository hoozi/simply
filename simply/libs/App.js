/**
 * App
 */
var http = require("http");

module.exports = App;
function App() {
    
    /*     
     * 以数组形式来保存中间件;
     * */
    var middleList = this._middleList = [], 
        that = this;
        
    /*     
     * 用于储存get监听器
     * */
    this._route_getHandle = {}
    
    /*     
     * 用于储存post监听器
     * */
    this._route_postHandle = {}

     
    function serverHandle(req, res) { 
        
        var middleIndex = 0;
        
        execMiddle();
        
        /*
         * next方法在中间件内部执行，表示当前中间件执行完毕后，执行下一个中间件;
         * */
        function next() {
            middleIndex++;
            execMiddle();
        }
        
        /*
         * 执行当前中间件;
         * */
        function execMiddle() {
            var middle = middleList[middleIndex];
            
            /*
             * 判断是否存在中间件
             * */  
            if(middle) {
                
                /*
                 * next以参数形式传入中间件的内部，在中间件内部执行；
                 * */
                middle(req, res, next);
            } else {
                var method = req.method,handle
                switch(method) {
                   case "GET":
                       handle = that._route_getHandle[req.url];
                   break;
                   case "POST":
                       handle = that._route_postHandle[req.url];
                   break; 
                }
                if(handle) {
                    handle(req, res)
                }
            }
        }
    }
    this._server = http.createServer(serverHandle);
}

//添加中间件
App.prototype.use = function(middle){
    this._middleList.push(middle)
}

//监听端口
App.prototype.listen = function() {
    this._server.listen.apply(this._server, arguments)
}

//get method
App.prototype.get = function(route, handle) {
    this._route_getHandle[route] = handle;
}

//post method
App.prototype.post = function(route, handle) {
    this._route_postHandle[route] = handle;
}

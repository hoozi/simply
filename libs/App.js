/**
 * @author Administrator
 */
var http = require("http");

module.exports = App;
function App() {
    
    /*     
     * 以数组形式来保存中间件;
     * */
    var middleList = this._middleList = [];
     
    function serverHandle(req, res) { 
        
        if(!middleList) {
            
        } else {
            var middleIndex = 0;
            
            execMiddle();
            
            /*
             * next方法在中间件内部调用，表示当前中间件执行完毕后，执行下一个中间件;
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
                if(middle) {
                    
                    /*
                     * next以参数形式传入中间件的内部，在中间件内部执行；
                     * */
                    middle(req, res, next);
                }
            }
            
            
        }
    }
    this._server = http.createServer(serverHandle);
}
App.prototype.use = function(middle){
    this._middleList.push(middle)
}
App.prototype.listen = function() {
    this._server.listen.apply(this._server, arguments)
}

const express = require('express')
const app = express()
var path = require('path')
var  connections = []
var bodyParser = require('body-parser')
var  route = require ('./route/index')
// app.use(bodyParser.json())  //解析后的数据转为json格式
const server = require('http').createServer(app);
//引包
const io = require('socket.io').listen(server)
//开启端口
app.use('/mongo/img/',express.static(path.join(__dirname,'./mongo/img')))
server.listen(process.env.PORT|| 3000)
console.log('开启成功')
//allow custom header and CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 
app.use(route)

io.sockets.on('connection',function(socket){
  connections.push(socket);

  socket.on('disconnect',function(data){
    connections.splice(connections.indexOf(socket),1);
  })

  //接收到 客户端传回的消息 
  socket.on("new message", function(data) {
    var time = new Date()
    var date = time.getTime()
     io.sockets.emit('send message',{msg:data,times:date})
  });
})
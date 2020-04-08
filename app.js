const express = require('express')
const app = express()
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var route = require('./route/index')
var socketHeard = require('./socket')
var Idtoid = require('./mongo/models/Idtoid') //储存 id
const server = require('http').createServer(app);
const socketio = require('socket.io')
var comm = []
//开启端口
app.use('/mongo/img/', express.static(path.join(__dirname, './mongo/img')))
console.log('开启成功')
//allow custom header and CORS
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())



//连接mongo 
mongoose.connect('mongodb://localhost/ws_demo', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, (err) => {
  //
  if (err) {
    console.log('连接失败')
  } else {
    console.log('连接成功')
    server.listen(process.env.PORT || 3000) //开启3000端口
    const io = socketio(server)


    //用户连接  
    io.on('connection', socket => {
      console.log('当前用户 id:' + socket.id)

      var socketid = socket.id //获取 用户 socket.id
      socket.on('login', (userid) => { //每次登录 的时候  就会向 mongoDB中 映射新的数据        
        socketHeard.saveUserSocketId(userid, socketid)


        socket.emit('login',{
            message:'登录成功',
            id:socketid
        })
    })



      socket.on('chat', (data) => { //服务端收到 用户发来的信息 (data)指的是 接收人的uid等一系列参数 
        console.log(data)
        Idtoid.findOne({
          userid: data.toUserid //找到对应的id
        }).then(rs => {
          console.log(rs)
          //找到对应用户后 将a的消息 转发给 b
          socket.to(rs.socketid).emit('newMessage',{
            f_id: data.form_id,
            time: data.time,
            message: data.data
          })
        })

      })


    })
  }


})

//挂载路由
app.use(route)
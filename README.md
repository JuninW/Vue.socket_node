# Vue.socket_node
**后端技术栈 [express + node.js + socket.io + mongodb]**
### 0. api列表
| 接口名                | 请求方式  |参数 | 接口描述                                     
| -------------------- | ------- | ---- | --------- |
| /login  | POST |  username,password |登录|
| /toregister | POST  | username ,password ,email ,phoneNum   |注册|                             
| /serach/user | GET | username 或 phoneNum | 查找用户|                                  
| /updateImg | POST | imgUrl (文件参数名) | 更新用户头像 |
| /Addfriends | POST | userID (查找用户后可以获得)|添加好友 |
|/friendList| GET | 暂无参数 | 用户好友列表 |
> **注** : 在登录过程中 直接 服务器会返回token  所以 除了 登录 和注册 以外 所有 api 都必须请求头	              .   携带token  

| socket     |   参数  |  描述    |
| :-------- | --------:| :------: |
|  login    |userid |  登录时向mongo 存入 用户id 以及 socket.id |
|  chat     |  data  |  给指定用户发送消息  |

>  **注** :  
>   data = {
>                 form_id : (用户自己的id)
>                 toUserid : (发送对象的id)
>                 message: 发送的信息内容 ;
>  }  

#### 1.业务介绍
	

>  这是一个关于 聊天 项目的  服务端 项目  后台 使用的是 node.js 技术  ,以前写的基本都以http请求为主的 项目  第一次 接触 Websocket 项目 ,在写法上面有些生疏 请多多 包涵 


#### 2.目录结构 
    |-- .gitignore  
    |-- app.js  (启动)
    |-- jwt.js  (生成token ,判断token合法性)
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- mongo    (mongo相关文件)
    |   |-- img  (储存用户头像)
    |   |-- models (mongo相关配置)
    |   |   |-- friend.js
    |   |   |-- Idtoid.js
    |   |   |-- user.js
    |   |-- schemas (mongo相关配置)
    |   |   |-- friend.js
    |   |   |-- Idtoid.js
    |   |   |-- user.js
    |   |-- tmp (临时储存用户头像目录)
    |-- route  (路由)
    |         |-- index.js
    |         |-- login.js
    |         |-- user.js
    |-- socket (关于socket的相关逻辑处理)
        |-- index.js

####  3.相关逻辑 

- app.js 
```javascript
  io.on('connection', socket => {
      console.log('当前用户 id:' + socket.id)

      var socketid = socket.id //获取 用户 socket.id
      socket.on('login', (userid) => { //每次登录 的时候  就会向 mongoDB中 映射新的数据        
        socketHeard.saveUserSocketId(userid, socketid)
      })
      
      socket.on('chat', (data) => { //服务端收到 用户发来的信息 (data)指的是 接收人的uid等一系列参数 
        console.log(data)
        Idtoid.findOne({
          userid: data.toUserid //找到对应的id
        }).then(rs => {
          console.log(rs)
          //找到对应用户后 将a的消息 转发给 b
          socket.to(rs.socketid).emit({
            f_id: data.form_id,
            time: data.time,
            message: data.data
          })
        })

      })


    })
```
>   待开发完善的模块
>   1. 关于聊天记录 和 留言功能 (假设用户不在线  )
>   2.  同一用户如果在多设备登录 同一账号    需要做对应处理 
>   3.  用户暂时 还无法发送 图片或表情相关内容 ,只能发送文字类 ,需要做相关模块的支持 

(如果对你的学习有所帮助 欢迎start~🎉)
个人博客 :http://www.junin.club

var express = require('express')
var route = express.Router()
//连接mongoDB
var Users = require('../mongo/sever')
var md5 = require('blueimp-md5')
var jwt =require('jsonwebtoken')
var settoken = require('../jwt')

//注册
route.post('/toregister',function (req, res) {
    let username = req.body.username
    let password = req.body.password
    Users.findOne(
        {
        $or: [
            {
                username: req.body.username
            },
            {
                email: req.body.email
            },
            {
                phoneNum:req.body.phoneNum
            }
             ]
        }).then(data=>{
            if(data){
              return  res.send({
                    err_code:401,
                    message:'已存在相同账号'
                })
            }else{
                req.body.password = md5(md5(req.body.password))
                  new Users(req.body).save(function(err,data){
                      if(err){
                          return  res.send({
                              err_code:402,
                              message:'账号注册失败'
                          })
                      }
                      settoken.setToken(username,password).then((data)=>{
                        return res.send({
                            token:data,
                            err_code:200,
                            message:'账号注册成功!',
                        })
                    })

                  })
            }
             
        }).catch(err=>{
            return res.send({
                err_code:'403',
                message:'服务器错误'
            })
        })
})

//登录
route.post('/login', function (req, res) {
    req.body.password = md5(md5(req.body.password))
    let username = req.body.username
    let password = req.body.password 
    Users.findOne({
        username:username,
        password:password
    }).then(item=>{
        if(item){
          return settoken.setToken(username,password).then((data)=>{
                 res.send({
                    token:data,
                    userInfo:{
                        username:item.username,
                        imgUrl:item.imgUrl
                    },
                    err_code:200,
                    message:'账号登录成功!',
                })
            })
        }
        res.send({
            err_code:401,
            message:'密码或账号错误'
        }) 

    }).catch(err=>{
       return res.send({
            err_code:402,
            message:'登录失败'
        }) 
    })
})

module.exports = route
var express = require('express')
var route = express.Router()
//连接mongoDB
var Users = require('../mongo/models/user')
var Friends = require('../mongo/models/friend')
var md5 = require('blueimp-md5')
var settoken = require('../jwt')

//注册  
route.post('/toregister', function (req, res) {
    let username = req.body.username
    let password = req.body.username
    Users.findOne({
        $or: [{
                username: req.body.username        
            },
            {
                email: req.body.email
            },
            {
                phoneNum: req.body.phoneNum
            }
        ]
    }).then(data => {
        if (data) {
            return res.status(402).send({
                err_code: 402,
                message: '已存在相同账号'
            })
        } else {
            req.body.password = md5(md5(req.body.password))
            new Users(req.body).save(function (err, data) {
                if (err) {
                    return res.send({
                        err_code: 402,
                        message: '账号注册失败'
                    })
                }
                //创建成功后 
                let uid = data._id
                return settoken.setToken(username, password).then((data) => {

                    res.send({
                        token: data,
                        userInfo: {
                            username: username,
                            imgUrl: '',
                            uid: uid

                        },
                        err_code: 200,
                        message: '注册成功!',
                    })
                })

            })
        }

    }).catch(err => {
        return res.status(403).send({
            err_code: '403',
            message: '服务器错误'
        })
    })
})

//登录
route.post('/login', function (req, res) {
    req.body.password = md5(md5(req.body.password))
    let username = req.body.username
    let password = req.body.password
    Users.findOne({
        username: username,
        password: password
    }).then(item => {
        if (item) {
            return settoken.setToken(item.username, item._id).then((data) => {
                res.status(200).send({
                    token: data,
                    userInfo: {
                        username: item.username,
                        imgUrl: item.imgUrl,
                        userId: item._id
                    },
                    err_code: 200,
                    message: '账号登录成功!',
                })
            })

        } else {
            return res.status(407).send({
                err_code: 407,
                message: '密码或账号错误'
            })
        }


    }).catch(err => {
        console.log(err)
        return res.status(500).send({
            err_code: 500,
            message: '服务器内部错误'
        })
    })
})

module.exports = route
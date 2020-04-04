var express = require('express')
var route = express.Router()
var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
var users = require('../mongo/models/user')
var Friends = require('../mongo/models/friend')

//查找用户 (手机号 / 用户名)
route.get('/serach/user', function (req, res) {
    users.findOne({
        $or: [{
                username: req.query.num
            },
            {
                phoneNum: req.query.num
            }
        ]
    }).then(data => {
        if (data) {
            return res.status(200).send({
                message: "查询成功",
                userInfo: {
                    userName: data.username,
                    userID: data._id,
                    userImg:data.imgUrl
                }
            })
        }
        return res.status(200).send({
            message:'没有找到对应用户',
        })
    }).catch(err => {
        res.status(503).send({
            message: "服务器问题查询失败"
        })
    })
})

//上传头像 
route.post('/updateImg', function (req, res) {
    var file = new formidable.IncomingForm();
    var ceil = Math.ceil(Math.random() * 100000);
    var time = new Date()
    var date = time.getTime()
    file.uploadDir = 'mongo/tmp';
    file.parse(req, (err, fields, files) => {
        var type = '.' + files.img.name.substring(files.img.name.lastIndexOf(".") + 1)
        let oldFile = path.join(__dirname, '../' + files.img.path);
        let newFile = path.join(__dirname, '../mongo/img/')
        fs.rename(oldFile, newFile + ceil + date + type, (err) => {
            if (!err) {
                var imgUrl = 'http://127.0.0.1:3000/mongo/img/' + ceil + date + type   
                users.updateOne({
                    username: req.data.name
                }, {
                    imgUrl: imgUrl
                }).then(item => {
                    fields.oldfile = fields.oldfile.split("http://127.0.0.1:3000/mongo/img/")[1]
                    console.log(__dirname + fields.oldfile)
                    fs.unlink(newFile + fields.oldfile, (err) => {        //上传图片 先删除原本图片的位置 
                        if (!err) {
                            console.log('删除成功')
                        }
                    })
                    return res.status(200).send({
                        status: true,
                        message: '上传成功',
                        imgUrl: imgUrl
                    })

                }).catch(err => {
                    res.status(503).send({
                        message: '服务器错误'
                    })
                })

            }
            return
        })
    })
})

//添加好友 
route.post('/Addfriends', function (req, res) {
    var status = null
    Friends.findOne({
        username: req.data.name
    }).then(data => {
        if (data != null) {
            var friendArr = new Array
            friendArr = data.friends

            //遍历 查看 当前是否已经存在该好友了 
            friendArr.forEach(item => {
                if (item.userID == req.body.userID) {
                    return status = 'error'
                }
            });

        }
        if (status != 'error') {
            //如果 有则 添加 如果没有 则 创建 
            Friends.updateOne({
                username: req.data.name
            }, {
                $push: {
                    friends: req.body
                }
            }, {
                upsert: true
            }).then(index => {
                return res.status(200).send({
                    status:'200',
                    message: '添加好友成功!'
                })
            }).catch(error => {
                return res.status(507).send({
                    err_code:507,
                    message: '服务器内部错误1'
                })
            })
        } else {
            return res.status(200).send({
                err_code:200,
                message: '该好友已存在'
            })
        }

    })
})

//获取好友列表
route.get('/friendList',function (req,res){
        Friends.findOne({
            username: req.data.name
        }).then(data=>{
            if(data!=null){
                return res.status(200).send({
                    message:'获取成功',
                    list:data.friends
                })
            }
            return res.status(200).send({
                message:'暂无好友'
            })
        }).catch(err=>{
            return res.status(500).send({
                message:'获取好友列表失败',
            })
        })
})

module.exports = route
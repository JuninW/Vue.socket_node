var express = require('express')
var route = express.Router()
var formidable = require('formidable')
var path = require('path')
var fs= require('fs')
var users = require('../mongo/sever')

//查找用户 (手机号 / 用户名)
route.get('/serach/user', function (req, res) {
    users.findOne({
        $or:[
            {
                username:req.query.num
            },
            {
                phoneNum:req.query.num
            }
        ]
    }).then(data => {
        if (data) {
            return res.status(200).send({
                message: "查询成功",
                userInfo: {
                    userName:data.username
                    // userImg:data[0].imgUrl
                }
            })
        }
    }).catch(err => {
        res.status(503).send({
            message: "服务器问题查询失败"
        })
    })
})

//上传头像 
route.post('/updateImg',function (req,res){
    var file = new formidable.IncomingForm();
    var time = new Date()
    var date = time.getTime()
    file.uploadDir = 'mongo/tmp';
    file.parse(req, (err, fields, files) => {
         let oldFile = path.join(__dirname, '../' + files.img.path);
         let newFile = path.join(__dirname, '../mongo/img/')
          fs.rename(oldFile, newFile + date + files.img.name, (err) => {
              if (!err) {
                  let imgUrl = 'http://localhost:3000/mongo/img/' + date + files.img.name
                  users.updateOne({
                      username:req.data.name
                  },{
                      imgUrl:imgUrl
                  }).then(item=>{
                    fields.oldfile = fields.oldfile.split("http://localhost:3000/mongo/img/")[1]
                    console.log(__dirname+fields.oldfile)
                    fs.unlink(newFile+fields.oldfile,(err)=>{
                        if(!err){
                            console.log('删除成功')
                        }
                    })
                    return res.status(200).send({
                        status: true,
                        message: '上传成功',
                        imgUrl: imgUrl
                    })
                    
                  }).catch(err=>{
                          res.status(503).send({
                              message:'服务器错误'
                          })
                  })
           
              }
              return 
          })
    })
})


module.exports = route
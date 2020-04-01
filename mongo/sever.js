var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/ws_demo', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true     //这个即是报的警告
  }).then(res => {
    console.log('数据库连接成功')
  })

//设计表
var userSchema = new Schema ({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String,
        required:true
    },
    imgUrl:{
        required:false
    }
})

module.exports = mongoose.model('User',userSchema)
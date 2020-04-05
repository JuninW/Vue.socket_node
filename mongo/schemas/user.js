
var mongoose = require('mongoose')

var Schema = mongoose.Schema

//设计表
module.exports = new Schema ({
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
        required:false,
        default:''
    }
})

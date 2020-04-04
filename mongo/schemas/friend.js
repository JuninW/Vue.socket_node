var mongoose = require('mongoose')

var Schema = mongoose.Schema
//设计表
module.exports= new Schema({
    username : {
        type: String,
        required:true
    },
    friends:{
        type: Array
    }
})

var mongoose = require('mongoose')
var friendSchema = require('../schemas/friend')

module.exports = mongoose.model('Friend',friendSchema)
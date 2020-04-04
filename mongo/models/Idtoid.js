let mongoose = require('mongoose');
let idtoidSchema = require('../schemas/Idtoid');
module.exports = mongoose.model('Idtoid',idtoidSchema);
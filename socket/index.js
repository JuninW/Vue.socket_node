let Idtoid = require('../mongo/models/Idtoid')

module.exports = class socketHandler {
    static async saveUserSocketId(userid, socketId) {
        //保存用户的id和socketid
        await Idtoid.findOne({
            userid: userid
        }).then((rs) => {
            if (!rs) {
                new Idtoid({
                    userid: userid,
                    socketid: socketId
                }).save().then(() => {
                })
            } else {
                Idtoid.updateOne({
                    userid: userid
                }, {
                    socketid: socketId
                }).then(() => {
                })
            }
        })
    }
};
var jwt = require('jsonwebtoken');
var signkey = 'juninToken';

exports.setToken = function (username, password) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name: username,
            _id: password
        }, signkey, {
            expiresIn: '30d'
        });
        resolve(token);
    })
}

exports.verToken = function (token) {
    token = token.split(' ')[1]
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, signkey ,(error, decoded) => {
            if (error) {
              return  error
            }
            return decoded
          });
        resolve(info);
    })

}
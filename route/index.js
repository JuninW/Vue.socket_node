var express = require('express')
var router = express.Router()
var expressJwt = require('express-jwt');
var vertoken = require('../jwt')
var login = require('./login')
var user = require('./user')

router.use(function(req, res, next) {
	var token = req.headers.authorization
	if(token == undefined){
		return next();
	}else{
		vertoken.verToken(token).then((data)=> {
			req.data = data
			return next();
		}).catch((error)=>{
			return next()
		})
	}
});


router.use(expressJwt({
	secret: 'juninToken'
}).unless({
	path: ['/login','/toregister']//除了这个地址，其他的URL都需要验证
}));

router.use(function (err, req, res, next){
	if(err.status == 401){
		return res.status(401).send({
			message:'Token失效'
		})
	}

	return next()
})

router.use(login)
router.use(user)

module.exports = router
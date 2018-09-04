const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY, )
        req.userData = verify
        next()
    } catch( err ) {
        return res.status(401).json({
            message: "Auth fail"
        })
    }

}
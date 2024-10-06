const { ROLES } = require("../utils/listValues")
const jwt = require('jsonwebtoken')


const adminAuthMiddleware = (req, res,next) => {
    const accessToken = req.cookies['access_token']
    if(!accessToken) {
        return res.status(401).json({
            msg: 'You do not have permission to access this resource'
        })
    }
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                msg: 'Authentication failed!!!'
            })
        } 
        if(decoded.role !== ROLES.ADMIN) {
            return res.status(403).json({
                msg: 'You do not have permission to access this resource'
            })
        }
    })

    next()
}

module.exports = adminAuthMiddleware
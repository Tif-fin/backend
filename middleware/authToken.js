const jwt = require("jsonwebtoken")
const { isEmpty } = require("../utils/const")

// generate webtoken 
const generateAuthToken = (user,expireIn='48h')=>jwt.sign(user,process.env.SECRET_KEY, { expiresIn: expireIn})

const AuthenticationToken = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies['token']
    if(isEmpty(token))
       return res.status(422).json({success:false,type:"token_empty",error:"Invalid Token"})
        jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err) {
            return res.status(401).json({success:false,type:"Error",error:err})
        }
        req.user = user
        next()
    })
}

module.exports = {generateAuthToken,AuthenticationToken}
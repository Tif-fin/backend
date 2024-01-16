const { isEmpty } = require("../utils/const")
const TiffinAccessToken = (req,res,next)=>{
    const token = req.headers['tiffin-api-key']
    if(isEmpty(token)){
        return res.status(401).json({success:false,error:"Api key required"})
    }
    if(token===process.env.TIFFIN_ACCESS_TOKEN){
        return next()
    }
    return res.status(401).json({success:false,error:"Invalid api key"})

}

module.exports = TiffinAccessToken
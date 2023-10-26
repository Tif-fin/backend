const ValidationError = require("../exception/ValidateError")
const fsp = require("../model/fsp")

exports.fspUniqueness = async(req,res,next)=>{
    let {name}= req.body||""
    name = name.toLowerCase()
    if(await fsp.findOne({name:name})){
       return next(new ValidationError(JSON.stringify({success:false,statusCode:422,errors:"FSP already exists."})))
    }
    next()
}
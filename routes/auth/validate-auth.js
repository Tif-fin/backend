const ValidationError = require("../../exception/ValidateError")
const { isEmpty } = require("../../utils/const")


const AuthValidator = (req,res,next)=>{
    const {email,password} = req.body
    let errors = []
    if(isEmpty(email))errors.push("Email is required field")
    if(isEmpty(password))errors.push("Password is required field")
    if(errors.length>0){
        const message = {
            success:false,
            statusCode:422,
            error:errors
        }
       next( new ValidationError(JSON.stringify(message)))
    }
    next()
}
module.exports = AuthValidator
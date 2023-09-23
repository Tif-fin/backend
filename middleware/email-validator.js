const { isEmpty, emailValidator } = require("../utils/const")

const EmailValidator = (req,res,next)=>{
    const {email} = req 
    let message = {
        success:false,
        statusCode:422,
        error:''
    }
    if(isEmpty(email)){
        message.error=`Email can't be empty`
       next( new ValidationError(JSON.stringify(message)))
    }else{
        if(emailValidator(email)){
            message.error=`Invalid email`
            next( new ValidationError(JSON.stringify(message)))
        }
        next()
    }
}

module.exports = {EmailValidator}
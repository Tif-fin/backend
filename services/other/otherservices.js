const PasswordReset = require("../../model/passwordResetModel")
const { generateCode } = require("../../utils/const")
const { sendPasswordResetCodeMail } = require("../mail/sendMail")


const passwordResetService = async(isEmail,user)=>{   
    try {
         //generate code 
        let genCode = generateCode(6)
         await PasswordReset({
            userId:user,
            resetThrough:isEmail?"email":"phonenumber",
            resetCode:genCode
        }).save()
        await sendPasswordResetCodeMail(user.email,user.firstname,genCode)
        return  Promise.resolve(true)
    } catch (error) {
        return  Promise.reject(false)
    }
}
module.exports = {passwordResetService}


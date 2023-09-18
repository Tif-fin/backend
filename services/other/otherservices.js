const PasswordReset = require("../../models/passwordResetModel")
const { generateCode } = require("../../common/utils")
const { sendPasswordResetCodeMail } = require("../mail/sendMail")


const PasswordResetService = async(isEmail,user)=>{   
    try {
         //generate code 
        let genCode = generateCode(6)
         await PasswordReset({
            userId:user,
            resetThrough:isEmail?"email":"username",
            resetCode:genCode
        }).save()
        await sendPasswordResetCodeMail(user.email,user.firstname,genCode)
        return  Promise.resolve(true)
    } catch (error) {
        return  Promise.reject(false)
    }
}
module.exports = {PasswordResetService}


const user = require("../model/user");

class VerificationService{


 async sendVerificationCode(email){
        const user =await user.findOne({email});
        const result=  await passwordResetService(true,user)
        return res.status(200).json({
            success:result,
            message:result?'Verification code is sent':'Failed to sent verification code'
        })
    }

}
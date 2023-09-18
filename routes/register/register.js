const ValidateRegister = require("../middleware/validate-register")
const User = require("../../model/user");
const { encryptPassword, generateCode } = require("../../utils/const");
const app = require("express").Router()
const EmailVerifier =  require("../../model/emailVerifierModel");
const { sendVerificationMail } = require("../../services/mail/sendMail");
//register user based on the phone number 
app.post("/",ValidateRegister,async(req,res,next)=>{
 try {
    let {user} = req
    user.password = await encryptPassword(user.password)
     const result = await new  User(user).save()
     if(result){
        const code = generateCode(6)
        const emailVerifier = await new EmailVerifier({userId: result,code}).save()
        await sendVerificationMail(user.email,user.firstname,code)
        result.password = undefined; 
       return res.status(200).json({success:true,user:result,isSendVerificationMail:emailVerifier!=null?true:false})
     }else{
        return res.status(200).json({success:false,error:"Failed to create user"})
     }
 } catch (error) {
    next(error);
 }
 
});


module.exports = app 


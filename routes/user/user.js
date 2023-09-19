const app = require("express").Router()
const User = require("../../model/user");
const { EmailValidator } = require("../middleware/email-validator");
const { passwordResetService } = require("../../services/other/otherservices");
const { uploadProfile, compressAndReturnUrlMiddleware } = require("../middleware/upload");
const { AuthenticationToken } = require("../middleware/authToken");
const { checkExistsAndDelete } = require("../../utils/compress");

app.patch('/edit/name',AuthenticationToken,async(req,res,next)=>{
    try {
        const {firstname,middlename,lastname} = req.body 
        const {userId} = req.user 
        const updateResult = await User.updateOne({_id:userId},{
            firstname,middlename,lastname
        })
        if(updateResult){
            return res.status(200).json({success:true,message:"Updated name successfully"});
        }else{
            return res.status(200).json({success:false,message:"Failed to update name"});
        }
    } catch (error) {
        next(error)
    }
});

app.patch('/edit/profile',AuthenticationToken,uploadProfile,compressAndReturnUrlMiddleware,async(req,res,next)=>{

    const {uploadedUrl} = req 
    const {userId} = req.user 
    try {
        const result = await User.updateOne({_id:userId},{
            profile:uploadedUrl[0]
        })
        if(result){
            return res.status(200).json({
                success:true,
                message:"Success",
                profile:uploadedUrl[0],
            })
        }else{
            checkExistsAndDelete(uploadedUrl[0])
            return res.status(200).json({
                success:false,
                error:"Failed to upload profile"
            })
        }
      
    } catch (error) {
        checkExistsAndDelete(uploadedUrl[0])
        next(error)
    }
   
})

app.post('/reset/',EmailValidator,async(req,res,next)=>{
    const {email} = req 
    try {
        const user =await User.findOne({email});
        const result=  await passwordResetService(true,user)
        return res.status(200).json({
            success:result,
            message:result?'Verification code is sent':'Failed to sent verification code'
        })
    } catch (error) {
        next(error)
    }
    


})



module.exports = app 


const ValidationError = require("../exception/ValidateError")
const User = require("../model/user")
const { generateAuthToken } = require("../middleware/authToken")
const { checkExistsAndDelete } = require("../utils/compress")
const { encryptPassword, comparePassword } = require("../utils/const")
const { removeAttribute } = require("../utils/user.hide.secrete")

//Create user 
exports.createUser = async(req,res,next)=>{
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
}
//Authenticate user 
exports.authUser = async(req,res,next)=>{
    const {email,password} = req.body;
    try {
       let currentUser = await User.findOne({email});
       if(!currentUser) {
           res.status(200).json({success:false,isLogin:false,message:"Invalid credentials"})
           return;
       }
       if(await comparePassword(password,currentUser.password)){
           let token = generateAuthToken({userId:currentUser._id,
              email:currentUser.email,role:currentUser.role});
               const cookieOptions = {
               expires: new Date(Date.now() + 1000 * 60 * 60 * 24), 
               httpOnly: true, // prevents JavaScript from accessing the cookie
               secure:true,
               sameSite: "none",
             }; 
           currentUser.password = undefined
           res.cookie('token',token,cookieOptions)
           res.setHeader('Access-Control-Allow-Credentials',true)
           res.status(200).json({success:true,isLogin:true,message:"Successully logged in",token,user:currentUser})
           res.end()
       }else{
          return res.status(200).json({success:false,isLogin:false,message:"Invalid credentials"})
       }
    } catch (err) {
       next(err)
    }
}
//Edit Name of the user  if exists 
exports.editName =async (req,res,next)=>{
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
}
//Update profile 
exports.editProfile = async(req,res,next)=>{
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
}
//send Verification code 
exports.sendVerificationCode = async(req,res,next)=>{
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
}
exports.getCurrentUser = async(req,res,next)=>{
    const {userId} = req.user 
    try {
        let user=await User.findOne({_id:userId});
        user = removeAttribute(Array.of(user),['password','__v','created_date'])
        return res.status(200).json({
            success:true,
            user:user[0]
        })
    } catch (error) {
        next(new ValidationError(JSON.stringify({success:false,statusCode:422,error:"Invalid user Id"})))
    }
}
exports.getUsers  = async(req,res,next)=>{
    try {
        let  users =await User.find({});
        users = removeAttribute(users,['password','__v','created_date'])
        return res.status(200).json({
            success:true,
            total:users.length,
            users
        })
    } catch (error) {
        next(error)
    }
}
exports.getUserById  = async(req,res,next)=>{
    const {userId} = req.params    
    req.user = {userId}
   this.getCurrentUser(req,res,next)
}
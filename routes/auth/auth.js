/* login or authenticate the user by
email or username and password 
*/
const app  = require("express").Router()
const { generateAuthToken } = require("../middleware/authToken")
const User = require("../../model/user")
const { comparePassword } = require("../../utils/const")
const AuthValidator = require("./validate-auth")

app.post("/",AuthValidator,async(req,res,next)=>{
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
    
});


module.exports = app 


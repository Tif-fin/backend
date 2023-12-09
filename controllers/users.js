const User = require("../model/user")
const { checkExistsAndDelete } = require("../utils/compress")
const { removeAttribute } = require("../utils/user.hide.secrete")
const userValidation = require("../validation/user/userValidation")
const userService = require("../services/userService")
const authValidation = require("../validation/authValidation")
const nameValidation = require("../validation/user/name.validation")
class UserController {
    //create a new user 
    async createUser(req,res){
   try {
        //validate data
        let data = userValidation.validate(req.body)
        //create a new user 
        const newUser = await userService.createUser(data)
        return res.status(200).json({success:true,data:newUser})
        } catch (error) {
            
            res.status(400).json({status:false, error: error.message });
        }
    }
    //Authenticate user 
    async authUser(req,res){
        try {
            //validate data
            const data= authValidation.validate(req.body)
            //authenticate user
            const result = await userService.auth({...data})
            const expire_at =  new Date(Date.now() + 1000 * 60 * 60 * 24*2)
            const cookieOptions = {
                    expires:expire_at, 
                    httpOnly: true, // prevents JavaScript from accessing the cookie
                    secure:true,
                    sameSite: "none",
                }; 
                //set token in the cookie
                res.cookie('token',result.token,cookieOptions)
                res.setHeader('Access-Control-Allow-Credentials',true)
                res.status(200).json({success:true,data:{...result,expire_at}})
                res.end()
          
         } catch (error) {
            res.status(400).json({status:false, error: error.message });
         }
    }
    //edit user name
    async editName  (req,res){
        try {
            //validate name
            const data = nameValidation.validate(req.body)
            const {userId} = req.user 
            //update name
            await userService.updateById(data,userId)
            return res.status(200).json({success:true,message:"Updated name successfully"});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    //edit profile 
       async editProfile (req,res,next){
            try {
                const {uploadedUrl} = req 
                const {userId} = req.user 
                //update 
                await userService.updateById({ profile:uploadedUrl[0]},userId)
                return res.status(200).json({success:true,data:{"profile":uploadedUrl[0]}})
            } catch (error) {
                //delete the uploaded image if and only if the image exists
                checkExistsAndDelete(uploadedUrl[0])
                res.status(400).json({status:false, error: error.message });
            }
        }

        async sendVerificationCode (req,res,next){
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
        //get current user 
      async  getCurrentUser (req,res,next){
            const {userId} = req.user 
            try {
                let user=await userService.getById(userId);
                user = removeAttribute(Array.of(user),['password','__v','created_date'])
                return res.status(200).json({success:true,data:user[0]})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }
        //get all the registered user 
        async getUsers  (req,res,next){
            try {
                let  users =await userService.getUsers();
                users = removeAttribute(users,['password','__v','created_date'])
                return res.status(200).json({success:true,data:users})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }
        async getUserById  (req,res,next){
            const {userId} = req.params    
            req.user = {userId}
            this.getCurrentUser(req,res,next)
        }
        async requestForVerifiedUser(req,res){
            const {userId} = req.user;
            const {fspId,credit} = req.body; 
            try {
                let result=await userService.requestForVerifiedUser({userId,credit,fspId});
                console.log(result);
                return res.status(200).json({success:true,data:result})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }

}

module.exports = new UserController();










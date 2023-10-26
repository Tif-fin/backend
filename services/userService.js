const { sendVerificationCode } = require("../controllers/users");
const { generateAuthToken } = require("../middleware/authToken");
const emailVerifierModel = require("../model/emailVerifierModel");
const user = require("../model/user");
const { generateCode, comparePassword } = require("../utils/const");
const { sendVerificationMail } = require("./mail/sendMail");

class UserService{


    async createUser(data){
        //encrypt the password 
        data.password = await encryptPassword(user.password)
        //save the user 
        const result = await new user(data).save()
        if(result){
            //generate code for the email verification
           const code = generateCode(6)
           //store the code 
           const emailVerifier = await new emailVerifierModel({userId: result,code}).save()
           //
           await sendVerificationMail(user.email,user.firstname,code)
           result.password = undefined; 
          return ({user:result,isSendVerificationMail:emailVerifier!=null?true:false});
        }else{
           throw new Error('Failed to create user')
        }
    }
    async auth ({email,password}){
        let currentUser = await user.findOne({email});
        if(!currentUser) throw new Error("Invalid credentials")
            
        if(await comparePassword(password,currentUser.password)){
            //generate auth token
            let token = generateAuthToken({userId:currentUser._id,email:currentUser.email,role:currentUser.role});
            currentUser.password = undefined
            return {token,user:currentUser}
        }else{
            throw new Error("Invalid credentials")
        } 
    }
  
    async updateById(data,_id){
        const updateResult = await user.updateOne({_id},data)
        if(!updateResult)throw new Error("Update fail")
        return
    }
   
    async getById(id){
        return  await user.findOne({_id:id});
    }
    async getUsers (){
        return await user.find({});
    }


    
}


module.exports = new UserService();
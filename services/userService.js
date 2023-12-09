const { generateAuthToken } = require("../middleware/authToken");
const emailVerifierModel = require("../model/emailVerifierModel");
const FSPTrustedUserFeature = require("../model/fsp_trusted_feature");
const user = require("../model/user");
const { generateCode, comparePassword, encryptPassword } = require("../utils/const");
const { sendVerificationMail } = require("./mail/sendMail");

class UserService{


    async createUser(data){
        //check existing user 
        if(await user.findOne({phoneNumber:data.phoneNumber}))throw new Error("Duplicate phone number")
        if(await user.findOne({email:data.email}))throw new Error("Duplicate email address")
        //encrypt the password 
        data.password = await encryptPassword(data.password)
        //save the user 
        const result = await new user(data).save()
        if(result){
            //generate code for the email verification
           const code = generateCode(6)
           //store the code 
           const emailVerifier = await new emailVerifierModel({userId: result,code}).save()
           //
           await sendVerificationMail(data.email,data.firstname,code)
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

    async requestForVerifiedUser({userId,credit,fspId}){
        const result = await FSPTrustedUserFeature.findOne({fspId})
        const index = result.users.findIndex((user)=>user.userId==userId)
        if(index!=-1){
            throw new Error("Already request")
        }
        return await FSPTrustedUserFeature.findOneAndUpdate({fspId:fspId},{
            $push:{
                users:{
                    userId,
                    credit
                }
            }
        })
    }

    
}


module.exports = new UserService();
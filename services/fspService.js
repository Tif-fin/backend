const fsp = require("../model/fsp");
const FSPTrustedUserFeature = require("../model/fsp_trusted_feature");
const { USERTYPE } = require("../utils/const");

// fsp service 
class FSPService{

    async createFSP(data){
        const isExisting = await fsp.findOne({ name: data.name});
        //check duplicate
        if (isExisting) {
          throw new Error('Duplicate food service provider');
        }
        // Create fsp
        const newFSP = new fsp(data);
        return await newFSP.save();;
    }
    async getAll(){
        return await fsp.find();
    }
    async getByMerchantId(id){
        return await fsp.find({merchantId:id});
    }
    async getFSPById(id){
        return await fsp.findById(id);
    }
    async checkPrivilege(userId){
        //check for merchant 
        if(await fsp.find({merchantId:userId})){
            return USERTYPE.MERCHANT; 
        }
        return USERTYPE.DEFAULT;
    }
    async update(fspId,userId,update){
            //check priivilege 
        if(await this.checkPrivilege(userId)!=USERTYPE.MERCHANT){
            throw new Error("Unauthorized");
        }
        return await fsp.updateOne({_id:fspId},update)
    }
    //search food service provider
    async searchFSPs(query){
        return await fsp.find({
            $or:[
                {name:{$regex: query, $options: "i" }},
                {description:{$regex: query, $options: "i" }}
            ]
        });
    }
    async getTrustedUserFeatureById({fspId}){
        return FSPTrustedUserFeature.findOne({fspId:fspId},'_id fspId isActive credits users')
        .populate({
            path: 'users.userId',
            model: 'users', 
            select: '_id phoneNumber firstname lastname email profile', 
          })
    }
    async createTrustedUserFeature(data){
        return await FSPTrustedUserFeature({...data}).save();
    }
    async updateTrustedUserFeature({userId,status,_id,fspId,message}){
        const data= await FSPTrustedUserFeature.findOne({fspId});
        const index = data.users.findIndex(user=>{
            return user._id==_id;
         })
         if(index!==-1){
             data.users[index].status=status;
             data.users[index].updatedAt =  Date.now();
             data.users[index].message = message;
         }else{
             throw new Error("User not found");
         }
        return await data.save();
    }
}


module.exports = new FSPService();
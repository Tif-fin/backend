const fsp = require("../model/fsp");
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
    

}


module.exports = new FSPService();
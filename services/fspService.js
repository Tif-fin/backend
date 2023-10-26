const fsp = require("../model/fsp");

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


}


module.exports = new FSPService();
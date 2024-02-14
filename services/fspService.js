const Banner = require("../model/banner_model");
const fsp = require("../model/fsp");
const FSPTrustedUserFeature = require("../model/fsp_trusted_feature");
const Order = require("../model/orders");
const { USERTYPE } = require("../utils/const");
const OrderS = require("./order/order");

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
    async getPaymentMethodForUser({userId,fspId}){
        const data = await FSPTrustedUserFeature.findOne({'users.userId':userId,fspId:fspId,isActive:true}).sort({createdAt:-1})
        let trusted_user = null;
        if(data){
            trusted_user = data.users.find(user=>user.userId.toString()===userId && user.status==='accept')
        }
        const orders =await Order.find({userId:userId,fspId:fspId,paymentStatus:"Pending",paymentMethod:"Credit"})
        let unpaid = 0;
        for(const item in orders){
            unpaid+= item["totalAmount"]
        }
        let paymentMethod = []
        if(trusted_user){
            trusted_user = {...trusted_user._doc,unpaid};
            paymentMethod.push("Trusted User Credit")
        }
        return {paymentMethod,trusted_user}
    }

    async createBanner({userId,data}){
        if(await this.checkPrivilege(userId)!=USERTYPE.MERCHANT){
            throw new Error("Unauthrozied user")
        }
        return await new Banner({...data,userId}).save()
    }
    async getBanner({fspId,userId}){
        if(userId!=null&&await this.checkPrivilege(userId)===USERTYPE.MERCHANT){
            return await Banner.find({fspId})
        }
        return await Banner.find({fspId,endDate:{$gt:Date.now()}}).limit(7)
    }
    
}


module.exports = new FSPService();
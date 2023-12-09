const fsp = require("../model/fsp")
const fspService = require("../services/fspService")
const { USERTYPE } = require("../utils/const")
const { removeAttribute } = require("../utils/user.hide.secrete")
const fspValidation = require("../validation/fspValidation")
const haversineDistance = require("../utils/distance")
const trusteduserfeature = require("../validation/trusteduserfeature")

class FSPController {

    async create(req,res,next){
        try {
            const data = {...req.body,merchantId:req.user.userId,meta:req.meta}
            //validate data
            const validateData=  fspValidation.validate(data)
            //create food service provider 
            const result = await fspService.createFSP(validateData)
            res.status(201).json({
                status:true,
                data: result,
              });

        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getAll(req,res,next){
        try {
            let fsps = await fspService.getAll();
            fsps = removeAttribute(fsps,['verification_histories',
            'verification_requests','employees','subscriptions','created_date','meta',
            'isVerified','isListing'
        ])
        return res.status(200).json({success:true,data:fsps})
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getCurrentUserFSP(req,res,next){
        try {
            const {userId} = req.user 
            let fsps = await fspService.getByMerchantId(userId);
        return res.status(200).json({success:true,data:fsps})
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async fetchFSPById(req,res,next){
        try {
            const {fspId} = req.query;
            const userId =req.user==undefined?undefined: req.user.userId; 
            let fsps = await fspService.getFSPById(fspId);
            const trusteduserfeature = await fspService.getTrustedUserFeatureById({fspId});
            console.log(trusteduserfeature);
            if(!userId){
                fsps = removeAttribute([fsps],['verification_histories',
                    'verification_requests','employees','subscriptions','created_date','meta',
                    'isVerified','isListing'
                ])
            }else{
                switch (await fspService.checkPrivilege(userId)) {
                    case USERTYPE.MERCHANT:
                        break;
                    default:
                        fsps = removeAttribute([fsps],['verification_histories',
                        'verification_requests','employees','subscriptions','created_date','meta',
                        'isVerified','isListing'
                    ])
                }
            }
          const data ={...fsps[0]._doc,trusteduserfeature}
        return res.status(200).json({success:true,data})
        } catch (error) {
            console.log(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async changeLogo(req,res){
        try {
            const {fspId} = req.body;
            const {userId} = req.user;
            const {uploadedUrl} = req;
            if(!fspId)throw new Error("Food service id is required")
            const result =await fspService.update(fspId,userId,{logo:uploadedUrl[0]})
            if(result){
                return res.status(200).json({status:true,data:{
                    logo:uploadedUrl[0]
                }})
            }else{
                throw new Error("Failed to change logo")
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async updateDescription(req,res){
       // description
       try {
        const {fspId,description} = req.body;
        const {userId} = req.user;
        if(!fspId)throw new Error("Food service id is required")
        const result =await fspService.update(fspId,userId,{description:description})
        if(result){
            return res.status(200).json({status:true,data:"success"})
        }else{
            throw new Error("Failed to change description")
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({status:false, error: error.message });
    }
    }
    async updateEmail(req,res){
        try {
            const {fspId,emails} = req.body;
            const {userId} = req.user;
            if(!fspId)throw new Error("Food service id is required")
            const result =await fspService.update(fspId,userId,{emails:emails})
            if(result){
                return res.status(200).json({status:true,data:"success"})
            }else{
                throw new Error("Failed to change description")
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async updateGeolocation(req,res){
        try {
            const {fspId,geolocation} = req.body;
            const {userId} = req.user;
            if(!fspId)throw new Error("Food service id is required")
            const result =await fspService.update(fspId,userId,{$set: {
                'address': {
                    geolocation: {
                      latitude: geolocation.latitude,
                      longitude: geolocation.longitude
                    }
                }
              }})
            if(result){
                return res.status(200).json({status:true,data:"success"})
            }else{
                throw new Error("Failed to update geolocation")
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getnear(req,res){
      try {
        const {user_latitude,user_longitude,maxDistance=15}=req.query;
        const fsps  =await fsp.find();
        let  newFsps = fsps.filter((fsp)=>fsp.address!=null);
        let dFsps = [];
        for(let index=0;index<newFsps.length;index++){
            if(newFsps[index].address.geolocation!=null){
                const {latitude,longitude} = newFsps[index].address.geolocation;
                const distance = haversineDistance(user_latitude,user_longitude,latitude,longitude);
               if(maxDistance>=distance)
                dFsps.push({...newFsps[index]._doc,distance})
            } 
        }
        dFsps = removeAttribute(dFsps,['verification_histories','verification_requests','employees','subscriptions','created_date','meta',])
        res.status(200).json({success:true,data:dFsps});
      } catch (error) {
        res.status(400).json({status:false, error: error.message });
      }

    }
    async getFSPTrustedFeature(req,res){
        try {
            const {fspId} = req.query;
            if(!fspId){
                throw new Error("FSPID is required")
            }
            let result = await fspService.getTrustedUserFeatureById({fspId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async createFSPTrustedFeature(req,res){
        try {
            const {userId} = req.user;
            const {fspId,credits} = req.body;
            const validatedData = trusteduserfeature.validate({createdBy:userId,fspId:fspId,credits:credits})
            const result = await fspService.createTrustedUserFeature(validatedData)
            console.log(result);
            res.status(200).json({success:true,data:result})
        } catch (error) {
            console.log(error.message);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async updateFSPTrustedFeature(req,res){
        try {
            const {userId} = req.user;
            const {fspId,_id,status,message} = req.body;
            const result = await fspService.updateTrustedUserFeature({
                _id,
                fspId,
                userId,
                status,
                message
            })
            console.log(result);
            res.status(200).json({success:true,data:result})
        } catch (error) {
            console.log(error.message);
            res.status(400).json({status:false, error: error.message });
        }
    }

}


module.exports = new FSPController();


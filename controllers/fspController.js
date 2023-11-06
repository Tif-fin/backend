const fspService = require("../services/fspService")
const { USERTYPE } = require("../utils/const")
const { removeAttribute } = require("../utils/user.hide.secrete")
const fspValidation = require("../validation/fspValidation")


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
            //switch (await fspService.checkPrivilege(userId)) {
            //    case USERTYPE.MERCHANT:
            //        break;
            //    default:
            //        fsps = removeAttribute(fsps,['verification_histories',
            //        'verification_requests','employees','subscriptions','created_date','meta',
            //        'isVerified','isListing'
            //    ])
            //}
          
        return res.status(200).json({success:true,data:fsps})
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async fetchFSPById(req,res,next){
        try {
            const {fspId} = req.query;
            const {userId} = req.user; 
            let fsps = await fspService.getFSPById(fspId);
            switch (await fspService.checkPrivilege(userId)) {
                case USERTYPE.MERCHANT:
                    break;
                default:
                    fsps = removeAttribute(fsps,['verification_histories',
                    'verification_requests','employees','subscriptions','created_date','meta',
                    'isVerified','isListing'
                ])
            }
          
        return res.status(200).json({success:true,data:fsps})
        } catch (error) {
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
    

}


module.exports = new FSPController();


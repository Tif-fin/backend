const fspService = require("../services/fspService");
const bannerValidation = require("../validation/bannerValidation");


class BannerController{

    async createBanner(req,res){
        try {
            const {userId} = req.user;
            const validatedData = bannerValidation.validate(req.body)
            const result = await fspService.createBanner({data:validatedData,userId})
            if(result){
                res.status(200).json({success:true,data:result})
            }else{
                throw new Error("Failed to create banner")
            }
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
    async getBanner(req,res){
        try {
            const {userId} = req.user;
            const {fspId} = req.query;
            const result = await fspService.getBanner({fspId,userId})
            if(result){
                res.status(200).json({success:true,data:result})
            }else{
                throw new Error("Failed to fetch banner")
            }
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }


}
const BannerC = new BannerController();

module.exports = BannerC;
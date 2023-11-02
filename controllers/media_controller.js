const mediaService = require("../services/mediaService")
const mediaValidation = require("../validation/mediaValidation")

class MediaController {

    async addMedia(req,res){
       try {
        const {uploadedUrl} = req
        const {userId} = req.user 
        const validateData= mediaValidation.validate({urls:uploadedUrl,userId,...req.body})
        const result = await mediaService.addMedia(validateData);
        if(!result){
           throw new Error("Failed to upload");
        }
        res.status(200).json({success:true,data:result})
       } catch (error) {
            res.status(400).json({status:false, error: error.message });
            
       }
    }


}

module.exports = new MediaController();

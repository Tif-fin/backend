const fspService = require("../services/fspService")
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
   
    

}


module.exports = new FSPController();


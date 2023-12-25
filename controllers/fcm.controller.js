const FCMS = require("../services/fcmService");


class FCMController{
    async addUser(req,res){
        try {
            const {userId} = req.user;
            const {token} = req.body;
            await FCMS.addUser({userId,token})
            res.status(200).json({success:true})
        } catch (error) {
            // console.log(error);
            res.status(500).json({success:false})
        }

    }

}

const FCMC = new FCMController();
module.exports = FCMC;

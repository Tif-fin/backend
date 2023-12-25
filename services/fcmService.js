const FCM = require("../model/fcmtoken_model");
const firebaseadmin = require("../utils/fcm")

class FCMService{
 async   addUser({userId,token}){
        if(!await FCM.findOne({userId,token})){
            return await FCM({userId,token}).save();
        }else{
          return await FCM.find({userId},{token});
        }
    }


    async notifyUser({title,body,token,data,channelId}){
      return await firebaseadmin.messaging().send({
            notification:{
                title,
                body
            },
            android: {
                notification: {
                  channelId: channelId,
                },
              },
              data:data,
            token:token
        })
    }

}

const FCMS = new FCMService();
module.exports = FCMS;
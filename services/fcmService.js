const FCM = require("../model/fcmtoken_model");
const Order = require("../model/orders");
const { isEmpty } = require("../utils/const");
const firebaseadmin = require("../utils/fcm")

class FCMService{
 async   addUser({userId,token}){
        if(!await FCM.findOne({userId,token})){
            return await FCM({userId,token}).save();
        }else{
          return await FCM.find({userId},{token});
        }
    }

    async  _handleRemoveToken({token}){
      await FCM.findOneAndDelete({token})
    }
    async notifyUser({title,body,token,data,channelId}){
      //messaging/registration-token-not-registered  
      try {
        return await firebaseadmin.messaging().send({
          notification:{
              title,
              body
          },
          android: {
            notification: {
              channelId: channelId
            },
          },
          data:data,
          token:token
      })  
      } catch (error) {
        console.log(error);
        if(error.code==='messaging/registration-token-not-registered'){
           return this._handleRemoveToken({token})
        }else{
          return null;
        }
       
      }
    }
    notifyOrderStatusChange = async({title,orderId,fspId,status})=>{
      const order =await Order.findOne({_id:orderId,fspId})
      .populate("fspId","name")
      .populate("userId","firstname lastname").exec();
      if(!order){
        return;
      }
      const {_id}= order.userId;//get the user id
      const data = {
        "orderId":orderId.toString()
      }
      const fcms =await FCM.find({userId:_id})// get the FCM 
      for(const fcm of fcms){
          const body = `${order.fspId.name}\n ${title} : ${status}`;
          await this.notifyUser({title,body,token:fcm.token,channelId:"order",data})
      }
      
    }

}

const FCMS = new FCMService();
module.exports = FCMS;
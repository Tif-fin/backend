const { default: mongoose } = require("mongoose");
const Order = require("../../model/orders");
const fsp = require("../../model/fsp");
const FCM = require("../../model/fcmtoken_model");
const FCMS = require("../fcmService");
const user = require("../../model/user");


class OrderService {

     createOrder= async({data,userId}) =>{
        const order=  await  Order({
            ...data,
            userId
        }).save();
       
        if(order){
            const {_id} =  order;
            const currentFSP = await fsp.findOne({_id:data.fspId})
            const orderPlacedBy = await user.findOne({_id:userId})
            const fcms =await FCM.find({userId:currentFSP.merchantId})
            for(const fcm of fcms){
                const title = `${currentFSP.name}`
                const body = `Order placed by ${orderPlacedBy.firstname} ${orderPlacedBy.lastname}`;
                const data={
                    "orderId":_id.toString()
                }
                await FCMS.notifyUser({title,body,token:fcm.token,channelId:"order",data})
            }

        }
        return order;
    }
    setPaymentMethodCOD = async ({userId,orderId})=>{
       const result = await Order.findOne({_id:orderId,userId:userId})
        if(result.paymentMethod==='None'){
            result.paymentMethod='Cash on Delivery';
        }else{
            throw new Error(`You have chosen ${result.paymentMethod} as your payment method and the payment status is ${result.paymentStatus}.`)
        }
        return result.save();
        
    }
    updateOrderStatus = async({orderId,fspId,status,userId})=>{
        await this.checkAuthorization({userId,fspId});
        return await Order.findOneAndUpdate({_id:new mongoose.Types.ObjectId(orderId),
            fspId:new mongoose.Types.ObjectId(fspId)},{
            status:status
        });
    }
    getRecentOrder = async({userId})=>{
        return await Order.find({userId,paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1}).limit(3)
    }
    getAllTodayOrders = async ({userId})=>{
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
        return   await Order.find({userId,
            createdAt:{$gt:today,$lt:tomorrow},
            paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1}).populate("userId","_id firstname lastname username profile email")
        .populate("fspId","_id logo name");
    }
    getAllOrders = async ({userId})=>{
        return   await Order.find({userId,
            paymentMethod:{
            $ne:"None"
        }}).populate("userId","_id firstname lastname username profile email")
        .populate("fspId","_id logo name").sort({createdAt: -1})
    }
    getOrderDetailsById= async({userId,orderId})=>{
        let order= await Order.findOne({_id:orderId})
        .populate("userId","_id firstname lastname username profile email")
        .populate("fspId","_id logo name");
        return order
    }
    async checkAuthorization({userId,fspId}){
        if(!await fsp.find({merchantId:userId,_id:fspId})){
            throw new Error("Authorized to this fsp")
        }
    }
    getAllTodayOrderByFSPId= async ({userId,fspId})=>{
        await this.checkAuthorization({fspId,userId});
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
        return Order.find({fspId,    
            createdAt:{$gt:today,$lt:tomorrow},
            paymentMethod:{
                $ne:"None"
            }
        })
        .populate("userId","_id firstname middlename lastname username profile email isVerified phoneNumber country_code")
       .sort({createdAt:-1})
    }
    getAllOrderByFSPId= async ({userId,fspId})=>{
        await this.checkAuthorization({fspId,userId});
       
        return await Order.find({fspId:new mongoose.Types.ObjectId(fspId),
            paymentMethod:{
                $ne:"None"
            }
        })
        .populate("userId","_id firstname middlename lastname username profile email isVerified phoneNumber country_code")
        .sort({createdAt:-1})
    }
    getCustomers = async({userId,fspId})=>{
        await this.checkAuthorization({fspId,userId});
        const uniqueUserIds =await Order.distinct("userId",{fspId});
        const userInfo = await user.find({ _id: { $in: uniqueUserIds } })
      .select('_id  email firstname middlename lastname profile')
      .exec();
        return  userInfo;
    }
    getAllOrderByUserId = async({userId,fspId,id})=>{
        await this.checkAuthorization({fspId,userId});
        return await Order.find({userId:id,fspId:fspId})
        .populate("userId","_id firstname lastname username profile email")
        .populate("fspId","_id logo name").sort({createdAt:-1});
    }
    updatePaymentStatus = async({orderId,fspId,status,userId})=>{
        await this.checkAuthorization({fspId,userId});
        return await Order.findOneAndUpdate({_id:orderId,fspId:fspId},{
            paymentStatus:status
        })
    }
}
const OrderS = new OrderService()
module.exports = OrderS;
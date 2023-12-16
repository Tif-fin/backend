const Rating = require("../model/rating");
const RatingS = require("../services/food/rating");
const CancellationS = require("../services/order/cancellation");
const OrderS = require("../services/order/order");
const order_validation = require("../validation/order_validation");


class Order{

    async createOrder(req,res){
        try {
            const {userId} = req.user;
            console.log(req.body);
            const validatedData = order_validation.validate(req.body)
            const result = await OrderS.createOrder({data:validatedData,userId})
            if(result){
                res.status(200).json({success:true,data:result})
            }else{
                throw new Error("Failed to place order")
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
    async orderPaymentMethod(req,res){
        try {
            const {userId} = req.user;
            const {method,orderId} = req.body;
            if(method!=='Credit'){
                throw new Error("Payment method not supported")
            }else{
                const result = await OrderS.setPaymentMethodCOD({userId,orderId})
                if(result){
                    res.status(200).json({success:true,data:result})
                }else{
                    throw new Error("Failed to choose payment method COD")
                }
            }
        } catch (error) {
           // console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }

    async getRecentOrder(req,res){
        try {
            const {userId} = req.user;
            const result = await OrderS.getRecentOrder({userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getAllOrders(req,res){
        try {
            const {userId} = req.user;
            const {today,fspId} = req.query;
            let result =[];
            if(today && fspId){
                result = today?await OrderS.getAllTodayOrderByFSPId({userId,fspId}):await OrderS.getAllOrderByFSPId({userId,fspId})
            }else{
                result = today?await OrderS.getAllTodayOrders({userId}): await OrderS.getAllOrders({userId})
            }
            return res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getOrderDetailsById(req,res){
        try {
            const {userId} = req.user;
            const {orderId} = req.query;
            const result = await OrderS.getOrderDetailsById({userId,orderId})
            const cancellation= await CancellationS.getCancellationByOrderId({orderId})
            const reviews = await RatingS.getReviewsByOrderId({orderId,userId})
            res.status(200).json({success:true,data:{...result._doc,cancellation,reviews}})
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    
    async getCustomers(req,res){
        try {
            const {userId} = req.user;
            const {fspId} = req.query;
            const result = await OrderS.getCustomers({userId,fspId})
            console.log(result);
            res.status(200).json({success:true,data:result})
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
  

}

const OrderController = new Order()
module.exports = OrderController;
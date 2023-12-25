const { default: mongoose } = require("mongoose")
const Rating = require("../../model/rating")
const DailyFoodMenu = require("../../model/daily_food_model")


class RatingService {

    async rate({data,userId}){
      
        if(await  Rating.findOne({userId,orderId:data.orderId,foodId:data.foodId})){
            throw new Error("Already rated")
        }
        const result = await Rating({...data,userId}).save()
        if(result){
            const _data = await DailyFoodMenu.findOne({fspId:new mongoose.Types.ObjectId(data.fspId),_id:new mongoose.Types.ObjectId(data.foodId)})
           // console.log(_data);
            if(_data){
                _data.rating = await this._getAverageRatingForFood({foodId:data.foodId})
                _data.review+=1;
                return await _data.save()
            }
        }
        return null
    }
     _getAverageRatingForFood = async function({foodId}) {
        try {
          const result = await Rating.aggregate([
            {
              $match: { foodId: new mongoose.Types.ObjectId(foodId) }
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$value' }
              }
            }
          ]);
      
          if (result.length > 0) {
            return result[0].averageRating;
          } else {
            return 0; 
          }
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
    };
    async getRateByuserId({userId,orderId}){
        return await Rating.find({userId,orderId})
    }
   async getReviews({foodId}){
    return await Rating.find({foodId})
    .populate("userId","_id firstname lastname profile")
   }
   async getReviewsByOrderId({orderId,userId}){
    return await Rating.find({orderId,userId})
    .populate("userId","_id firstname lastname profile")
   }


}
const RatingS = new RatingService()

module.exports = RatingS
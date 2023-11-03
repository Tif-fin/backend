const { default: mongoose } = require("mongoose");
const foodModel = require("../../model/foodModel");


class FoodService{

    async createFoodMenu(data){
        const existingMenu = await foodModel.findOne({ name: data.name,
            classification:data.classification,
            category:data.category,
            storeId:data.storeId
         });
        if (existingMenu) {
          throw new Error('Duplicate food menu entry');
        }
        // Create the food menu if no duplicates are found
        const newFoodMenu = new foodModel(data);
        const createdFoodMenu = await newFoodMenu.save();
        return createdFoodMenu;
       
    }

    async getAllFoodMenus() {
        try {
           
          const foodMenus = await foodModel.find()
          .populate({
            path:'fspId',
            select:'_id name merchantId logo canDeliver isVerified'
          }).populate({
            path:'categoryId',
            select:"_id name foodTypeId fspId",
            populate:{
                path:'foodTypeId',
                select:'fspId type createdBy'
            }
          })
          return foodMenus;
        } catch (error) {
          throw new Error('Failed to fetch food menus');
        }
    }
    async getAllFoodByGroupCategory(){
        try {
         
            const foods = await foodModel.aggregate([
                {
                    $group:{
                        _id:'$categoryId',
                        foodItems:{$push:'$$ROOT'},
                    }
                },{
                    $lookup:{
                        from:'categories',
                        localField:'_id',
                        foreignField:'_id',
                        as:'category'
                    }
                }
            ])
            console.log(foods);
            return foods;
          } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch food menus');
          }
    }
    async getAllFoodByGroupCategoryByFSP(id){
        
        try {
            const aggregationPipeline = [
               {
                $match:{
                    fspId:new mongoose.Types.ObjectId(id),
                }
               },
                {
                $group: {
                    _id: '$categoryId',
                  foodItems: { $push: '$$ROOT' },
                },
              },
              {
                $lookup: {
                  from: 'categories', // Replace with your actual collection name
                  localField: '_id',
                  foreignField: '_id',
                 as:'category'
                },
              },
                
              ];
          
            const foods = await foodModel.aggregate(aggregationPipeline,{allowDiskUse:true})
           
            return foods;
          } catch (error) {
           console.log(error);
            throw new Error('Failed to fetch food menus');
          }
    }
    async getAllFoodByCategory(category){
        try {
            // Fetch all food menus from the database
            const foodMenus = await foodModel.find({category:category});
            return foodMenus;
          } catch (error) {
            throw new Error('Failed to fetch food menus by category');
          }
    }
    async getAllFoodByClassification(classification){
        try {
            // Fetch all food menus from the database
            const foodMenus = await foodModel.find({classification:classification});
            return foodMenus;
          } catch (error) {
            throw new Error('Failed to fetch food menus by classification');
          }
    }

}

module.exports = new FoodService();

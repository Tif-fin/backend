const categoryModel = require("../../model/categoryModel");
const DailyFoodMenu = require("../../model/daily_food_model");
const FoodType = require("../../model/food.type.model");
const Food = require("../../model/foodModel");

class CategoryService{

    async create(data){
        //check user privilege data.createdBy

        //Check already category already exists or not 
        if(await categoryModel.findOne({name:data.name,fspId:data.fspId,foodTypeId:data.foodTypeId}))
        throw new Error("Already exists")

        const result = await new categoryModel(data).save();
        if(!result)throw new Error("Failed to create category")
        return result
    }
    async createFoodType(data){
        
        //check user privilege data.createdBy
        if(await FoodType.findOne({type:data.type}))
        throw new Error("Already exists")

        const result = await new FoodType(data).save();
        if(!result)throw new Error("Failed to food type");
        return result
    }
    async getAllCategory(){
        await this.getAllTodayCategory();
        return await categoryModel.find().sort({createdAt:-1});
    }
    async getAllCategoryByFSPId(id){
        return await categoryModel.find({
            fspId:id,
            
        }).sort({createdAt:-1});
    }
    async getAllFoodType(){
        return await FoodType.find();
    }

    async deleteCategoryById(id,userId,fspId){
        //check here user is authorized or not
        // if(await Food.findOne({categoryId:mongoose})){
        //     throw new Error("Unable to delete category.")
        // }
        throw new Error("Feature not available at this time");
        // return await  categoryModel.deleteOne({
        //     _id:id,
        //     fspId:fspId
        // })
    }
    async getAllTodayCategory(){
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
    
        const result= await DailyFoodMenu.find({
            timestamp:{$gt:today,$lt:tomorrow}
        },'categoryId').populate('categoryId','name foodTypeId url fspId createdBy updatedAt updatedBy __v');
        let categories=[];
        const uniqueCategories = new Set();
        for(const item of result){
            if(item.categoryId!==null){
                const categoryData = item['categoryId']._doc;
                const categoryId = categoryData._id.toString();
                if (!uniqueCategories.has(categoryId)) {
                    categories.push({ ...categoryData });
                    uniqueCategories.add(categoryId);
                }
            }
            
        }
    return categories;
    }
    async searchCategory(query){
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
    
        const result= await DailyFoodMenu.find({
            timestamp:{$gt:today,$lt:tomorrow},
            name:{$regex:query,$options:'i'}
        },'categoryId').populate('categoryId','name foodTypeId url fspId createdBy updatedAt updatedBy __v');
        let categories=[];
        const uniqueCategories = new Set();
        for(const item of result){
            const categoryData = item['categoryId']._doc;
            const categoryId = categoryData._id.toString();
            if (!uniqueCategories.has(categoryId)) {
                categories.push({ ...categoryData });
                uniqueCategories.add(categoryId);
            }
        }
    return categories;
    }
}

module.exports = new CategoryService();
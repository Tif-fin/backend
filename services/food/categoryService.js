const categoryModel = require("../../model/categoryModel");
const FoodType = require("../../model/food.type.model");

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
        return await  categoryModel.deleteOne({
            _id:id,
            fspId:fspId
        })
    }

}

module.exports = new CategoryService();
const categoryService = require("../services/food/categoryService");
const categoryValidation = require("../validation/categoryValidation");
const foodTypeValidation = require("../validation/foodTypeValidation");
const foodValidation = require("../validation/foodValidation");

class CategoryController{

    async create(req,res){
        try {
            const {userId} = req.user
            let  data = req.body 
            data = {...data,createdBy:userId}
            data = categoryValidation.validate(data);
            const result = await categoryService.create(data);
            res.status(200).json({status:true,data:result});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async createFoodType(req,res){
        try {
            const {userId} = req.user
            let  data = req.body 
            data = {...data,createdBy:userId}
            data = foodTypeValidation.validate(data);
            const result = await categoryService.createFoodType(data);
            res.status(200).json({status:true,data:result});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getAllCategoryByFSPId(req,res){
        try {
            const fspId = req.query.fspId;
            if(!fspId)throw new Error("Food service provider id is required")
            res.status(200).json({status:true,data:await categoryService.getAllCategoryByFSPId(fspId)});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getAllCategory(req,res){
        try {
            res.status(200).json({status:true,data:await categoryService.getAllCategory()});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async getAllFoodType(req,res){
        try {
            res.status(200).json({status:true,data:await categoryService.getAllFoodType()});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    async deleteCategoryById(req,res){
        try {
            const {fspId,_id} = req.body 
            const {userId} = req.user 
            const result = await categoryService.deleteCategoryById(_id,userId,fspId);
            if(!result){
                throw new Error("Failed to delete category");
            }
            res.status(200).json({success:true,message:"Category deleted successfully"})
        } catch (error) {
             res.status(400).json({status:false, error: error.message });
        }
    }
    async getAllTodayCategories(req,res){
        try {
            res.status(200).json({status:true,data:await categoryService.getAllTodayCategory()});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }

}
module.exports = new CategoryController();
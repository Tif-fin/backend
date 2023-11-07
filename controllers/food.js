const foodService = require("../services/food/foodService");
const foodValidation = require("../validation/foodValidation");

class FoodMenuController{
    //create a new menu 
    async create(req,res){
        try {
            const {userId} = req.user
            let  data = req.body 
        
            data = {...data,createdBy:userId}
            //validate data 
            const validatedData = foodValidation.validate(data);
            //create a new food menu
            const createdFoodMenu =  await foodService.createFoodMenu(validatedData);
            //response with success 
            res.status(201).json({
                status:true,
                data: createdFoodMenu,
              });
        } catch (error) {
           
            res.status(400).json({status:false, error: error.message });
        }
    }

    async createMenuForToday(req,res){
        try {
           const {userId} = req.user
            let  data = req.body 
            data.forEach(element => {
                //updated createdBy id
                element.createdBy= userId;
                delete  element.__v;
                delete element._id;
            });
            const validatedData = foodValidation.validateArray(data)
              //create a today  food menu
            const createdFoodMenu =  await foodService.createFoodMenuForToday(validatedData);
            //response with success 
            res.status(201).json({
                status:true,
                data: createdFoodMenu,
              });
        } catch (error) {
           console.log(error);
            res.status(400).json({status:false, error: error.message });
        }
    }

    async fetchAllFoods(req,res){
        try {
            const items =  await foodService.getAllFoodMenus();
            //response with success 
            res.status(201).json({
                status:true,
                data: items,
              });
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    
    async fetchAllTodayFoodsGroupByCategory(req,res){
        try {
            const {fspId} = req.query;
            const items =  await foodService.getAllTodayFoodsGroupByCategory(fspId);
            res.status(201).json({
                status:true,
                data: items,
              });
        } catch (error) {
            console.log(error);
            res.status(400).json({status:false, error: error.message });
        }
    }

    async fetchFoodByGroupCategory(req,res){
        try {
            const {fspId} = req.query;
            const items =  await foodService.getAllFoodByGroupCategoryByFSP(fspId);
            res.status(201).json({
                status:true,
                data: items,
              });
        } catch (error) {
            console.log(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    async fetchFoodById(req,res){
        try {
            const {foodId} = req.query;
            const items =  await foodService.getFoodById(foodId);
            const foodName = items.name;
            const categoryName = items.categoryId['name'];
            const relatedItems = await foodService.relatedFoods(foodId,foodName,categoryName)
            res.status(201).json({
                status:true,
                data: {food:items,relatedItems},
              });
        } catch (error) {
            console.error(error);
            res.status(400).json({status:false, error: error.message });
        }
    }
    //fetchByCategoryId
    async fetchByCategoryId(req,res){
        try {
            const {categoryId} = req.query;
            const items =  await foodService.foodByCategoryId(categoryId);
            res.status(201).json({
                status:true,
                data: items,
              });
        } catch (error) {
            console.error(error);
            res.status(400).json({status:false, error: error.message });
        }
    }

}

module.exports = new FoodMenuController();
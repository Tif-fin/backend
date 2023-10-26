const foodService = require("../services/food/foodService");
const foodValidation = require("../validation/foodValidation");

class FoodMenuController{
    //create a new menu 
    async create(req,res){
        try {
            const {userId} = req.user
            let  data = req.body 
        
            data = {...data,merchantId:userId}
            //validate data 
            const validatedData = foodValidation.validateCreate(data);
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



}

module.exports = new FoodMenuController();
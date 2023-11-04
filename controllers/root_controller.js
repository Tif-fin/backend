const foodService = require("../services/food/foodService");


class RootController{

    async getAllFoods(req,res){
        try{
          
            const result =await foodService.getAllFoodMenus();
            res.status(200).json({success:true,data:result})

        }catch(error){
            res.status(500).json({success:false,error:error.message})
        }


    }


}

module.exports = new RootController();
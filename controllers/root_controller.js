const categoryService = require("../services/food/categoryService");
const foodService = require("../services/food/foodService");
const fspService = require("../services/fspService");
const { removeAttribute } = require("../utils/user.hide.secrete");


class RootController{

    async getAllFoods(req,res){
        try{
            const {longitude,latitude} = req.query;
            if(longitude && latitude){
                console.log("On the basis of the region");
            }
            const result =await foodService.getAllFoodMenus();
            const foodByCategory = await foodService.getTodaysFoodsGroupByCategory();
            const category = await categoryService.getAllCategory();
            const foodType = await categoryService.getAllFoodType();
            let fsps = await fspService.getAll(); 
            //remove attributes 
            fsps = removeAttribute(fsps,['verification_histories',
                    'verification_requests','employees','subscriptions','created_date','meta'
                ])

            res.status(200).json({success:true,data:{
                allFoods:result,
                foodByCategory,
                category:category,
                foodType:foodType,
                fsps
            }})

        }catch(error){
          
            res.status(500).json({success:false,error:error.message})
        }


    }


}

module.exports = new RootController();
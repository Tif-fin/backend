const categoryModel = require("../model/categoryModel");
const DailyFoodMenu = require("../model/daily_food_model");
const FoodType = require("../model/food.type.model");
const Food = require("../model/foodModel");
const fsp = require("../model/fsp");
const Media = require("../model/mediaModel");
const categoryService = require("../services/food/categoryService");
const foodService = require("../services/food/foodService");
const fspService = require("../services/fspService");
const { removeAttribute } = require("../utils/user.hide.secrete");


class RootController{

    async getAllFoods(req,res){
        try{
            const {longitude,latitude} = req.query;
            if(longitude && latitude){
               // console.log("On the basis of the region");
            }
            const result =await foodService.getAllFoodMenus();
            const foodByCategory = await foodService.getTodaysFoodsGroupByCategory();
            const category = await categoryService.getAllTodayCategory();
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
    
    async search(req,res){
        try{
            const {q} = req.query;
            const foods=await foodService.searchFood(q);
            const categories = await categoryService.searchCategory(q);
            const fsps =await fspService.searchFSPs(q);
            res.status(200).json({success:true,data:{
                foods,
                categories,
                fsps
            }})

        }catch(error){
            console.debug(error);
            res.status(500).json({success:false,error:error.message})
        }


    }
}

module.exports = new RootController();
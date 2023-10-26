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
          // Fetch all food menus from the database
          const foodMenus = await foodModel.find();
          return foodMenus;
        } catch (error) {
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

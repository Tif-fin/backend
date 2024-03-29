const food = require("../controllers/food");
const RatingC = require("../controllers/rating");
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()

/*Create a food menu */
app.post("/",AuthenticationToken,food.create);
app.get("/",food.fetchAllFoods);
app.get("/foodId",food.fetchFoodById);
app.get("/category",food.fetchFoodByGroupCategory);
app.get("/today",food.fetchAllTodayFoodsGroupByCategory);
app.post("/today",AuthenticationToken,food.createMenuForToday);
app.patch('/today',AuthenticationToken,food.updateMenuForToday)
app.get("/categoryId",food.fetchByCategoryId);//fetch by category ID 
app.post("/review",AuthenticationToken,RatingC.rate);
app.get("/review",AuthenticationToken,RatingC.getReview);
module.exports = app 
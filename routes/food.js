const food = require("../controllers/food")
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()

/*Create a food menu */
app.post("/",AuthenticationToken,food.create);
app.get("/",food.fetchAllFoods);
app.get("/category",food.fetchFoodByGroupCategory);


module.exports = app 
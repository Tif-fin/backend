const categoryController = require("../controllers/category.controller")
const food = require("../controllers/food")
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()


app.post('/',AuthenticationToken,categoryController.create);
app.post('/foodType',AuthenticationToken,categoryController.createFoodType);



module.exports = app 
const categoryController = require("../controllers/category.controller")
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()
app.post('/',AuthenticationToken,categoryController.create);
app.post('/foodType',AuthenticationToken,categoryController.createFoodType);
app.get('/',categoryController.getAllCategory);
app.delete('/',AuthenticationToken,categoryController.deleteCategoryById)
app.get('/id',categoryController.getAllCategoryByFSPId);
app.get('/foodType',categoryController.getAllFoodType);
app.get('/today',categoryController.getAllTodayCategories);

module.exports = app 
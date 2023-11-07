const root_controller = require("../controllers/root_controller");

const app = require("express").Router()

app.get('/',root_controller.getAllFoods);

module.exports = app 
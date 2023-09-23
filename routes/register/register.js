const ValidateRegister = require("../../middleware/validate-register")
const app = require("express").Router()
const { createUser } = require("../../controllers/users");
//register user based on the phone number 
app.post("/",ValidateRegister,createUser);
module.exports = app 


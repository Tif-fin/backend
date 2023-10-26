const app = require("express").Router()
const users = require("../controllers/users");

//register user based on the phone number 
app.post("/",users.createUser);

module.exports = app 


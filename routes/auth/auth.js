/* login or authenticate the user by
email or username and password 
*/
const app  = require("express").Router()
const AuthValidator = require("./validate-auth")
const { authUser } = require("../../controllers/users")
app.post("/",AuthValidator,authUser);

module.exports = app 


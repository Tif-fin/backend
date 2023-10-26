
const fspController = require("../controllers/fspController")
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()

app.post("/",AuthenticationToken,fspController.create);
app.get("/",AuthenticationToken,fspController.getAll);



module.exports = app 
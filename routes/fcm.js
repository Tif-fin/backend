const FCMC = require("../controllers/fcm.controller");
const { AuthenticationToken } = require("../middleware/authToken");

const app = require("express").Router()

app.post('/',AuthenticationToken,FCMC.addUser);

module.exports = app 
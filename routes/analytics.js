
const AnalyticsC = require("../controllers/analytics")
const { AuthenticationToken } = require("../middleware/authToken")


const app = require("express").Router()

app.get("/",AnalyticsC.orderAnalytics)

module.exports = app 
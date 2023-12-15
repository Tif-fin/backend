const OrderController = require("../controllers/order_controller")
const { AuthenticationToken } = require("../middleware/authToken")
const OrderS = require("../services/order/order")

const app = require("express").Router()

app.post('/',AuthenticationToken,OrderController.createOrder)
app.patch('/payment',AuthenticationToken,OrderController.orderPaymentMethod)
app.get('/detail',AuthenticationToken,OrderController.getOrderDetailsById)
app.get('/',AuthenticationToken,OrderController.getAllOrders)
module.exports = app 
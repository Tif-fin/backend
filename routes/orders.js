const OrderController = require("../controllers/order_controller")
const { AuthenticationToken } = require("../middleware/authToken")
const app = require("express").Router()

app.post('/',AuthenticationToken,OrderController.createOrder)
app.patch('/payment',AuthenticationToken,OrderController.orderPaymentMethod)
app.patch('/status',AuthenticationToken,OrderController.updateOrderStatus)
app.patch('/paymentstatus',AuthenticationToken,OrderController.updatePaymentStatus)
app.get('/detail',AuthenticationToken,OrderController.getOrderDetailsById)
app.get('/',AuthenticationToken,OrderController.getAllOrders)
app.get('/user',AuthenticationToken,OrderController.getAllOrderByUserId)
app.get('/customers',AuthenticationToken,OrderController.getCustomers)
module.exports = app 
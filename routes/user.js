const app = require("express").Router()
const { uploadProfile, compressAndReturnUrlMiddleware } = require("../middleware/upload");
const { AuthenticationToken } = require("../middleware/authToken");
const users = require("../controllers/users");

app.patch('/edit/name',AuthenticationToken,users.editName);
app.patch('/edit/profile',AuthenticationToken,uploadProfile,compressAndReturnUrlMiddleware,users.editProfile)
app.post('/reset/',users.sendVerificationCode)
app.get('/',AuthenticationToken,users.getCurrentUser)
app.get('/all',users.getUsers)
app.get('/:userId',users.getUserById)

module.exports = app 


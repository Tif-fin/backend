const app = require("express").Router()
const { EmailValidator } = require("../../middleware/email-validator");
const { uploadProfile, compressAndReturnUrlMiddleware } = require("../../middleware/upload");
const { AuthenticationToken } = require("../../middleware/authToken");
const { editName, editProfile, sendVerificationCode, getCurrentUser, getUsers, getUserById } = require("../../controllers/users");

app.patch('/edit/name',AuthenticationToken,editName);
app.patch('/edit/profile',AuthenticationToken,uploadProfile,compressAndReturnUrlMiddleware,editProfile)
app.post('/reset/',EmailValidator,sendVerificationCode)
app.get('/',AuthenticationToken,getCurrentUser)
app.get('/all',getUsers)
app.get('/:userId',getUserById)

module.exports = app 


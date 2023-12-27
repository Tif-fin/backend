
const fspController = require("../controllers/fspController");
const users = require("../controllers/users");
const { AuthenticationToken } = require("../middleware/authToken");
const { uploadStoreLogo, compressAndReturnUrlMiddleware } = require("../middleware/upload");


const app = require("express").Router()

app.post("/",AuthenticationToken,fspController.create);
app.get("/",AuthenticationToken,fspController.getAll);
app.get("/fspId",fspController.fetchFSPById);
app.get('/current',AuthenticationToken,fspController.getCurrentUserFSP)
app.patch('/logo',AuthenticationToken,uploadStoreLogo,compressAndReturnUrlMiddleware,fspController.changeLogo)
app.patch('/description',AuthenticationToken,fspController.updateDescription);
app.patch('/emails',AuthenticationToken,fspController.updateEmail);
app.patch('/geolocation',AuthenticationToken,fspController.updateGeolocation)
app.get('/near',fspController.getnear)
app.get('/trusted_user_feature',fspController.getFSPTrustedFeature)
app.post('/trusted_user_feature',AuthenticationToken,fspController.createFSPTrustedFeature)
app.post('/trusted_user_feature/request',AuthenticationToken,users.requestForVerifiedUser)
app.patch('/trusted_user_feature',AuthenticationToken,fspController.updateFSPTrustedFeature)
app.get('/payment_methods',AuthenticationToken,fspController.getPaymentMethodForUser)
app.patch("/hours",AuthenticationToken,fspController.updateOpeningAndClosingHours)
module.exports = app 

const fspController = require("../controllers/fspController")
const { AuthenticationToken } = require("../middleware/authToken");
const { uploadStoreLogo, compressAndReturnUrlMiddleware } = require("../middleware/upload");


const app = require("express").Router()

app.post("/",AuthenticationToken,fspController.create);
app.get("/",AuthenticationToken,fspController.getAll);
app.get("/fspId",AuthenticationToken,fspController.fetchFSPById);
app.get('/current',AuthenticationToken,fspController.getCurrentUserFSP)
app.patch('/logo',AuthenticationToken,uploadStoreLogo,compressAndReturnUrlMiddleware,fspController.changeLogo)
app.patch('/description',AuthenticationToken,fspController.updateDescription);
app.patch('/emails',AuthenticationToken,fspController.updateEmail);
module.exports = app 
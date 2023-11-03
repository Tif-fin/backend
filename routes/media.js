const media_controller = require("../controllers/media_controller");
const { AuthenticationToken } = require("../middleware/authToken");
const { uploadProductMedia, compressAndReturnUrlMiddleware } = require("../middleware/upload");

const app = require("express").Router()


app.post("/",AuthenticationToken,uploadProductMedia,compressAndReturnUrlMiddleware,media_controller.addMedia);
app.get("/",AuthenticationToken,media_controller.getAllMedia)

module.exports = app;
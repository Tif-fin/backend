const dotenv = require("dotenv");
dotenv.config({
    path:'./config/config.env'
});
const express = require("express");
const app = express();
const cluster = require("cluster");
const  os = require("node:os");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const userRoute = require('./routes/user');
const fspRoute = require("./routes/fsp");
const categoryRoute = require("./routes/category");
const menuRoute = require("./routes/food");
const rootRoute = require("./routes/root");
const fcmRoute = require("./routes/fcm");
const mediaRoute=require("./routes/media");
const orderRoute=require("./routes/orders");
const connectDB = require("./config/db.connect");
const ValidationError = require("./exception/ValidateError");
const { ipAddress } = require("./middleware/ip-address");
const users = require("./controllers/users");
const root_controller = require("./controllers/root_controller");
// const schedule = require('node-schedule');
// const axios = require('axios');
const TiffinAccessToken = require("./middleware/tiffin-api-token");
// schedule.scheduleJob('*/5 * * * *', function(){
//     // console.log("Started");
//     axios.get('https://tiffin-xoui.onrender.com/')
//   .then(function (response) {
//     // handle success
//     // console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     // console.log(error);
//   })
//   .finally(function () {
//     // always executed
//   });
// });


// number of cpu or core available 
const numCPUS = os.cpus().length;
connectDB();
// Middleware 
app.use('*',cors({
    origin:true,
    credentials:true
}));
app.set('assets', path.join(__dirname, 'assets'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



//handle routes here 
app.use(ipAddress);
app.use(TiffinAccessToken);
app.get('/',rootRoute);
app.get('/search',root_controller.search)
app.use('/user',userRoute);
app.post('/login',users.authUser);
app.post("/register",users.createUser);
app.use('/fsp',fspRoute);
app.use("/food",menuRoute);
app.use("/category",categoryRoute)
app.use("/media",mediaRoute)
app.use("/order",orderRoute)
app.use("/fcm",fcmRoute)
//handle error here 
app.use((err,req,res,next)=>{
    if(err){
    
        let statusCode = err.statusCode||500;
        let message = err.message||'Internal Server Error';
        if(err instanceof SyntaxError){
            statusCode = 400;
            message = 'Bad Request: Invalid JSON';
        }else if(err instanceof ValidationError){
            const json = JSON.parse(err.message)
            statusCode = json.statusCode
            message = json.errors||json.error  
        }
        return res.status(statusCode).json({success:false,error:message})
      }
    next()
})


// start the primary process 
if(cluster.isPrimary){
    for(let i=0;i<numCPUS;i++)cluster.fork()
    cluster.on('exit', (worker, code, signal) => {
        // console.log(`worker ${worker.process.pid} died`);
      });
}else{
    //listening to the port 
    app.listen(process.env.PORT||8000,()=>{
        // console.log("Tiffin Listening");
    })
    console.log(`Worker ${process.pid} started`);
}

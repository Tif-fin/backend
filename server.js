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
const { TiffinAccessToken } = require("./middleware/tiffin-api-token");
const registerRoute= require('./routes/register/register')
const authRoute = require('./routes/auth/auth');
const userRoute = require('./routes/user/user');
const { AuthenticationToken } = require("./middleware/authToken");
const User = require("./model/user");
const connectDB = require("./config/db.connect");
const ValidationError = require("./exception/ValidateError");
const { stat } = require("fs/promises");
const { ipAddress } = require("./middleware/ip-address");
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
app.use(ipAddress)
app.use(TiffinAccessToken)
app.get('/',async(req,res)=>{
    return res.json({
        success:true,
        meta:req.meta
    });
});
app.use('/user',userRoute)
app.use('/register',registerRoute)
app.use('/login',authRoute)


//handle error here 
app.use((err,req,res,next)=>{
    if(err){
        let statusCode = err.statusCode||500;
        let message = 'Internal Server Error';
        if(err instanceof SyntaxError){
            statusCode = 400;
            message = 'Bad Request: Invalid JSON';
        }else if(err instanceof ValidationError){
            const json = JSON.parse(err.message)
            statusCode = json.statusCode
            message = json.errors||json.error  
        }
        console.log(err);
        return res.status(statusCode).json({success:false,error:message})
      }
    next()
})


// start the primary process 
if(cluster.isPrimary){
    for(let i=0;i<numCPUS;i++)cluster.fork()
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}else{
    //listening to the port 
    app.listen(process.env.PORT||8000,()=>{
        console.log("Tiffin Listening");
    })
    console.log(`Worker ${process.pid} started`);
}

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cluster = require("cluster");
const  os = require("node:os");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const { TiffinAccessToken } = require("./routes/middleware/tiffin-api-token");
const registerRoute= require('./routes/register/register')
const authRoute = require('./routes/auth/auth')
// number of cpu or core available 
const numCPUS = os.cpus().length;

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
app.get('/',(req,res)=>{
    return req.json({
        success:true
    });
});
app.use('/register',registerRoute)
app.use('/login',authRoute)
app.use(TiffinAccessToken)

//handle error here 
app.use((err,req,res,next)=>{
    if(err){
       try {
        const message = JSON.parse(err.message)
        return res.status(message.statusCode).json(message)
       } catch (error) {
        return res.json({success:false,error})
       }
      }
    next()
})

//connection to the mongodb
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log(err);
    console.log("Connection failed");
});

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

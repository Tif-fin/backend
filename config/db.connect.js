const mongoose = require("mongoose");

const connectDB = ()=>{
//connection to the mongodb
mongoose.connect(process.env.MONGO_CONNECTION_STRING,{
    autoIndex:true,
    
}).then(()=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log("Connection failed");
});
}
module.exports = connectDB
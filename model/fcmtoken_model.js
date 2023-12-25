const mongoose = require('mongoose');


// Define the Mongoose schema
const FCMSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    token:{
        type:String,
        default:""
    }
});

// Create a Mongoose model based on the schema
const FCM = mongoose.model('fcm', FCMSchema);

module.exports = FCM;

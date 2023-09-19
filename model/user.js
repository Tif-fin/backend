const {  default: mongoose } = require("mongoose");
const { USERTYPE } = require("../utils/const");

const UserSchema = new mongoose.Schema({
    created_date:{type:Date,default:Date.now()},
    country_code:{type:String,require:true},
    phoneNumber:{type:String,require:true,unique:true},
    firstname:{type:String,require:true},
    middlename:{type:String,require:false,default:""},
    lastname:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    emailVerified:{type:Boolean,default:false},
    dob:{type:Date,require:true},
    profile:{type:String,require:false,default:null},
    password:{type:String},
    role:{type:String,enum:[USERTYPE.COSTUMER,USERTYPE.DEFAULT,USERTYPE.EMPLOYEE,USERTYPE.MERCHANT,
        USERTYPE.SUPEREMPLOYEE,USERTYPE.SUPERUSER
    ],default:USERTYPE.DEFAULT},
    address:{
        country:{type:String},
        state:{type:String},
        city:{type:String},
        district:{type:String},
        addressLine1:{type:String},
        addressLine2:{type:String},
        geolocation:{
            type:Object,
            properties:{
                latitude:{type:String}, 
                longitude:{type:String}
            }
        }
    }
})
UserSchema.index({
    firstname:'text',
    lastname:'text',
    username:'text'
})
module.exports = mongoose.model("users",UserSchema)
const {  default: mongoose, Schema } = require("mongoose");
const { SIZE, SUBSCRIPTIONMODEL, SUBSCRIPTIONLEVEL } = require("../utils/const");
const FSPSchema = new mongoose.Schema({
    created_date:{type:Date,default:Date.now()},
    name:{type:String,unique:true,required:true},
    merchantId:{type:Schema.Types.ObjectId,required:true},
    description:{type:String,required:true},
    logo:{type:String,default:null},
    size:{type:String,enum:[SIZE.Large,SIZE.Medium,SIZE.Small],default:SIZE.Small},
    socailMedia:[],
    address:{
        type:Object,
        default:null,
        properties:{
            country:{type:String,default:null},
            state:{type:String,default:null},
            city:{type:String,default:null},
            district:{type:String,default:null},
            addressLine1:{type:String,default:null},
            addressLine2:{type:String,default:null},
            geolocation:{
                type:Object,
                properties:{
                    latitude:{type:String,default:null}, 
                    longitude:{type:String,default:null}
                }
            }
        }
    },
    canDeliver:{type:Boolean,default:false},
    contacts:[
        {
            type:Object,
            default:null,
            properties:{
                type:{type:String},
                value:{type:String}
            }
        }
    ],
    subscriptions:[
        {
            type:Object,
            properties:{
                subscriptionModel:{type:String,enum:[SUBSCRIPTIONMODEL.Annual,SUBSCRIPTIONMODEL.Monthly,SUBSCRIPTIONMODEL.Freemium],default:SUBSCRIPTIONMODEL.Freemium},
                subscriptionLevel:{type:String,enum:[SUBSCRIPTIONLEVEL.Basic,SUBSCRIPTIONLEVEL.Medium,SUBSCRIPTIONLEVEL.Premium],default:SUBSCRIPTIONLEVEL.Basic},
                paymentMethod:{type:String,default:"None"},
                subscribed_date:{type:Date,default:Date.now(),require:true},
                expire_on:{type:Date,default:null},
            }
        }
    ],
    employees:[
        {
            type:Object,
            properties:{
                joined_date:{type:Date,default:Date.now()},
                status:{type:Boolean,default:false},
                role:{type:String},
                permissions:[],
                leave_date:{type:Date,default:null}
            }
        }
    ],
    review:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0.0
    },
    emails:[],
    status:{type:Boolean,default:false},// is store is currently live or not 
    isListing:{type:Boolean,default:false},// is the store is listing or not in the app || controlled by superuser 
    isVerified:{type:Boolean,default:false},// Is this is a verified fsp by tiffin?
    verification_requests:[

    ],
    verification_histories:[
        {
            type:Object,
            properties:{
                verified_by:{type:Schema.Types.ObjectId,ref:"users"},
                verified_at:{type:Date,default:Date.now()},
                status:{type:Boolean},
                message:{type:String,required:true}
            }
        }
    ],
    meta:{type:Object}
})

module.exports = mongoose.model("fsps",FSPSchema)
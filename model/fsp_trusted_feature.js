const { default: mongoose } = require("mongoose");


const FSPTrustedUserFeatureSchema = mongoose.Schema({
    fspId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"fsps",
        required:true,
        unique:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:false,
        default:null,
    },
    credits:[
        {
            type:Number
        }
    ],
    users:[
        {
            userId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref:"users",
                required:true,
                unique:true,
            },
            credit:{
                type:Number,
                default:0.0,
                required:true,
            },
            status: {
                type: String,
                enum: ['processing', 'reject', 'accept'],
                default:"processing",
                required: true,
            },
            message:{type:String,default:null},
            createdAt:{
                type:Date,
                default:Date.now(),
            },
            updatedAt:{
                type:Date,
                default:null,
            },
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:null,
    },



});


const FSPTrustedUserFeature = mongoose.model("fsptrusteduser",FSPTrustedUserFeatureSchema)

module.exports = FSPTrustedUserFeature;
const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
        minlength: 3,
    },
    url:{
        type:String,
        required:true
    },
    foodTypeId:{
        type:Schema.Types.ObjectId,
        ref:"foodType",
        require:true
    },
    fspId:{
        type:Schema.Types.ObjectId,
        ref:"fsps",
        require:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:null
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        default:null
    }

});

CategorySchema.index({
  name:String
});
module.exports = mongoose.model("category",CategorySchema);
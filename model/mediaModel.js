const { default: mongoose } = require("mongoose");

const MediaSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        require:true,
    },
    fspId:{
        type:mongoose.Schema.ObjectId,
        ref:"fsps",
        require:true,

    },
    name:{
        type:String,
        require:true,
        index:true,
    },
    description:{
        type:String,
        require:true,
        index:true
    },
    private:{
        type:Boolean,
        default:true //determine shared resource
    },
    urls:{
        type: [String],
        require:true
    },
    created_at:{
        type: Date,
        default:Date.now
    }
})

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;
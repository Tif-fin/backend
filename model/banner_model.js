const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  fspId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"fsps"},
  userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"users"},
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },                                                                           
  startDate: { type: Date, required: true,default:null },
  endDate: { type: Date, required: true,default:null },
  isActive: { type: Boolean, default: true },
  created_date:{type:Date,default:Date.now()}
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;

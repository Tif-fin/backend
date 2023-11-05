const mongoose = require('mongoose');


// Define the Mongoose schema
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description:{
    type:String,
    default:"",
  },
  createdBy: {
    type: String,
    required: true
  },
  fspId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"fsps",
    required: true,
    trim: true
  },
  price: {
    mrp: {
      type: Number,
      required: true,
      min: 0
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: null
    }
  },
  urls: {
    type: [String],
    validate: {
      validator: (array) => array.length >= 1,
      message: 'At least one URL is required.'
    }
  },
  classification: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"category",
    required: true
  },
  timestamp:{
    type:Date,
    default:Date.now
  },
  review:{
    type:Number,
    default:0
  },
  rating:{
    type:Number,
    default:0.0,
  },
  isAvailable:{
    type:Boolean,
    default:true
  }
});


// Create a Mongoose model based on the schema
const DailyFoodMenu = mongoose.model('dailyfoodMenu', foodSchema);

module.exports = DailyFoodMenu;

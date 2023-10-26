// models/foodMenuModel.js
const mongoose = require('mongoose');

const foodMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  merchantId: {
    type: String,
    required: true,
    trim: true,
  },
  storeId: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
  },
  urls: {
    type: [String],
    required: true,
    validate: {
      validator: (array) => array.length >= 1,
      message: 'At least one URL is required',
    },
  },
  classification: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg'],
  },
  category: {
    type: String,
    required: true,
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  rating:{
    type:Number,
    default:0
  },
  reviews:{
    type:Number,
    default:0,
  },
  lastUpdated:{
    type:Date,
    default:null,
  }
});

module.exports = mongoose.model('foodmenu', foodMenuSchema);

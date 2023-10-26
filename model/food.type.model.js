const mongoose = require('mongoose');

const foodTypeSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fspId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fsps', 
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 64,
    default: '',
  },
});

const FoodType = mongoose.model('foodType', foodTypeSchema);

module.exports = FoodType;

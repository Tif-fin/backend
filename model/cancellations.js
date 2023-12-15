const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
    fspId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fsps',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },  
    orderId:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
  foods: [
    {
      name: {
        type: String,
        required: true,
      },
      urls:{
        type:Array,
        default:[]
      },
      price:{
        type:Number,
        required:true
      },
      quantity: {
        type: Number,
        required: true,
      },
      foodId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dailyfoodMenu',
        required: true,
      },
     
    },
  ],
  status: {
    type: String,
    enum: ['Pending', 'Rejected','Cancelled'],
    default: 'Pending',
  },
  cancelAt: {
    type: Date,
    default: Date.now,
  }
});





const Cancellation = mongoose.model('cancellation', cancellationSchema);

module.exports = Cancellation;

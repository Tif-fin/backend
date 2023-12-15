const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    fspId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fsps',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
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
      note:{
        type:String,
        max:100,
        default:null
      },
      foodId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dailyfoodMenu',
        required: true,
      },
     
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    default: 0, 
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  billingAddress: {
    address1: String,
    city: String,
    fullName:String,
    phoneNumber:String,
    state: String,
    landmark: String,
    country: String
  },
  deliveryAddress: {
    address1: String,
    fullName:String,
    city: String,
    phoneNumber:String,
    state: String,
    landmark: String,
    country: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card','Trusted User Credit', 'Esewa', 'Cash on Delivery','None'],
  },
  delivery:{type:Boolean,default:false},

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

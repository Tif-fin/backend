const Joi = require('joi');

const orderSchema = Joi.object({
  fspId: Joi.string().required(),
  foods: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      urls: Joi.array().items(Joi.string()).default([]),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      foodId: Joi.string().required(),
      note:Joi.string().max(100).allow('').default(null),
    })
  ).required(),
  totalAmount: Joi.number().required(),
  deliveryCharge: Joi.number().default(0),
  status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').default('Pending'),
  billingAddress: Joi.object({
    address1: Joi.string(),
    city: Joi.string(),
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    state: Joi.string(),
    landmark: Joi.string(),
    country: Joi.string(),
  }).allow(null).default(null),

  deliveryAddress: Joi.object({
    address1: Joi.string(),
    fullName: Joi.string(),
    city: Joi.string(),
    phoneNumber: Joi.string(),
    state: Joi.string(),
    landmark: Joi.string(),
    country: Joi.string(),
    label:Joi.string(),
  }).allow(null).default(null),
  delivery:Joi.bool().default(false),
  paymentMethod: Joi.string().valid('Credit Card', 'Esewa','Trusted User Credit', 'Cash on Delivery','None').default('None'),
  paymentStatus: Joi.string().valid('Pending', 'Completed', 'Failed').default('Pending'),
  createdAt: Joi.date().default(Date.now),
});


module.exports = {
    validate:(data)=>{
        const { error, value } = orderSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};



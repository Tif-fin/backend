const Joi = require("joi");

const foodSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  description:Joi.string().trim().allow(''),
  createdBy: Joi.string().required(),
  fspId: Joi.string().trim().required(),
  price: Joi.object({
    mrp: Joi.number().required().min(0),
    compareAtPrice: Joi.number().min(0).allow(null)
  }),
  urls: Joi.array().min(1),
  classification: Joi.string().valid("veg", "non-veg").required(),
  categoryId: Joi.string().required(),
});
const foodItemsSchema = Joi.array().items(foodSchema);
module.exports = {
    validateArray:(data)=>{
        const { error, value } = foodItemsSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    },
  validate: (data) => {
    const { error, value } = foodSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return value;
  },
};

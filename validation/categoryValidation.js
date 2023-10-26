const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().required().trim().min(3),
  url: Joi.string().required(),
  fspId: Joi.string().required(),
  foodTypeId:Joi.string().required(),
  createdBy: Joi.string().required(), 
  createdAt: Joi.date().default(Date.now()),
  updatedAt: Joi.date().allow(null).default(null),
  updatedBy: Joi.string().allow(null).default(null),
  
});

module.exports = {
    validate:(data)=>{
        const { error, value } = categorySchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};

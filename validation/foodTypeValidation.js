const Joi = require('joi');

const foodTypeSchema = Joi.object({
  createdBy:Joi.string().required(),
  createdAt:Joi.date(),
  fspId:Joi.string().allow(null),
  type: Joi.string().required(),
  description: Joi.string().max(64).allow(''),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = foodTypeSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};

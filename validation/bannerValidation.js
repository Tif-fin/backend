const Joi = require("joi");
const bannerValidationSchema = Joi.object({
  fspId: Joi.string().required(),
  title: Joi.string().required(),
  imageUrl: Joi.string().required(),
  description: Joi.string().required(),
  link: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  isActive: Joi.boolean().default(true),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = bannerValidationSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
}
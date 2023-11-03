const Joi = require('joi');

const mediaJoiSchema = Joi.object({
  fspId:Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().required(),
  private: Joi.boolean().default(true),
  urls: Joi.array().items(Joi.string()).required(),
  created_at: Joi.date().default(Date.now),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = mediaJoiSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};

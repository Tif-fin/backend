const Joi = require('joi');

const FSPTrustedUserFeatureJoiSchema = Joi.object({
    fspId: Joi.string().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().allow(null),
    credits: Joi.array().items(Joi.number()).required(),
    createdAt: Joi.date().default(Date.now()),
    updatedAt: Joi.date().allow(null),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = FSPTrustedUserFeatureJoiSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};


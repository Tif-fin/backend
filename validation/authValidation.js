const Joi = require("joi");

const authSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
});

module.exports = {
    validate:(data)=>{
        const { error, value } = authSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
}
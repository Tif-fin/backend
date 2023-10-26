const Joi = require("joi");

const nameSchema = Joi.object({
    firstname: Joi.string().required(),
    middlename: Joi.string().default(''),
    lastname: Joi.string().required()
})
module.exports = {
    validate:(data)=>{
        const {error,value} = nameSchema.validate(data)
        if(error){
            throw new Error(error.details[0].message)
        }
        return value
    }
}
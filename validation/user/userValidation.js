const Joi = require('joi');
const { USERTYPE, passwordStrengthChecker } = require('../../utils/const');

const UserSchema = Joi.object({
  created_date: Joi.date(),
  country_code: Joi.string().required(),
  phoneNumber: Joi.string().length(10).required(),
  firstname: Joi.string().required(),
  middlename: Joi.string().default(''),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  emailVerified: Joi.boolean().default(false),
  dob: Joi.date().required(),
  profile: Joi.string().default(null),
  password: Joi.string().custom((value, helpers) => {
    if (passwordStrengthChecker(password)!==2) {
      return helpers.message('Password is too weak. Please choose a stronger password.');
    }

    return value;
  }),
  confirmPassword: Joi.string()
  .valid(Joi.ref('password'))
  .required()
  .messages({
    'any.only': 'Passwords do not match',
  }),
  meta: Joi.object({
    ipaddress: Joi.string(),
    userAgent: Joi.string(),
  }),
  role: Joi.string().valid(
    USERTYPE.COSTUMER,
    USERTYPE.DEFAULT,
    USERTYPE.EMPLOYEE,
    USERTYPE.MERCHANT,
    USERTYPE.SUPEREMPLOYEE,
    USERTYPE.SUPERUSER
  ).default(USERTYPE.DEFAULT),
  address: Joi.object({
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    geolocation: Joi.object({
      latitude: Joi.string(),
      longitude: Joi.string(),
    }),
  }).default(null),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = UserSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};

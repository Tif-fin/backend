const Joi = require('joi');
const { SIZE, SUBSCRIPTIONLEVEL, SUBSCRIPTIONMODEL } = require('../utils/const');


const fspSchema = Joi.object({
  created_date: Joi.date(),
  name: Joi.string().trim().required(),
  merchantId: Joi.string().required(),
  description: Joi.string().required(),
  logo: Joi.string(),
  size: Joi.string().valid(SIZE.Large, SIZE.Medium, SIZE.Small).default(SIZE.Small),
  socailMedia: Joi.array(),
  address: Joi.object({
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    geolocation: Joi.object({
      type: Joi.string(),
      properties: Joi.object({
        latitude: Joi.string(),
        longitude: Joi.string(),
      }),
    }),
  }),
  canDeliver: Joi.boolean().default(false),
  contacts: Joi.array().items(
    Joi.object({
      type: Joi.string(),
      value: Joi.string(),
    })
  ),
  subscriptions: Joi.array().items(
    Joi.object({
      subscriptionModel: Joi.string().valid(
        SUBSCRIPTIONMODEL.Annual,
        SUBSCRIPTIONMODEL.Monthly,
        SUBSCRIPTIONMODEL.Freemium
      ).default(SUBSCRIPTIONMODEL.Freemium),
      subscriptionLevel: Joi.string().valid(
        SUBSCRIPTIONLEVEL.Basic,
        SUBSCRIPTIONLEVEL.Medium,
        SUBSCRIPTIONLEVEL.Premium
      ).default(SUBSCRIPTIONLEVEL.Basic),
      paymentMethod: Joi.string().default('None'),
      subscribed_date: Joi.date().required(),
      expire_on: Joi.date().default(null),
    })
  ),
  employees: Joi.array().items(
    Joi.object({
      joined_date: Joi.date().default(Joi.ref('$created_date')),
      status: Joi.boolean().default(false),
      role: Joi.string(),
      permissions: Joi.array(),
      leave_date: Joi.date().default(null),
    })
  ),
  emails: Joi.array(),
  status: Joi.boolean().default(false),
  isListing: Joi.boolean().default(false),
  isVerified: Joi.boolean().default(false),
  verification_requests: Joi.array(),
  // Verification may be fail so this is required 
  verification_histories: Joi.array().items(
    Joi.object({
      verified_by: Joi.string().required(),
      verified_at: Joi.date().default(Joi.ref('$created_date')),
      status: Joi.boolean(),
      message: Joi.string().required(),
    })
  ),
  meta: Joi.object(),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = fspSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};

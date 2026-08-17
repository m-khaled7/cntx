import Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production'),
    SERVICE_NAME: Joi.string(),
    PORT: Joi.number(),

    GOOGLE_API_KEY: Joi.string().required(),
    GOOGLE_GEN_MODEL: Joi.string(),
});

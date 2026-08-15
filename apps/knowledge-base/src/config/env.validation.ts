import Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production'),
    SERVICE_NAME: Joi.string(),
    PORT: Joi.number(),

    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),

    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_PORT: Joi.number().required(),
    MINIO_SSL: Joi.boolean().required(),
    MINIO_ACCESS: Joi.string().required(),
    MINIO_SECRET: Joi.string().required(),

    RMQ_URL: Joi.string().required(),

    GOOGLE_API_KEY: Joi.string().required(),
    GOOGLE_EMBED_MODEL: Joi.string(),

    COHERE_API:Joi.string().required(),
    RERANKER_MODEL:Joi.string().required()
});

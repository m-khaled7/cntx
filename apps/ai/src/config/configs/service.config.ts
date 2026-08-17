import { registerAs } from "@nestjs/config";

export default registerAs('service', () => ({
    name: process.env.APP_NAME ?? 'ai-service',
    environment: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3004),
}));

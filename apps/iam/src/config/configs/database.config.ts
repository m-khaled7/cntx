import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    name: string | undefined;
}

export default registerAs("database", ():DatabaseConfig => ({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
}));

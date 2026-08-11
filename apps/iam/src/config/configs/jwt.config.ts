import { registerAs } from "@nestjs/config";

export interface JWTConfig {
    accessSecret: string;
    refreshSecret: string;
    accessExp: string;
    refreshExp: string;
}
export default registerAs(
    "jwt",
    (): JWTConfig => ({
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExp: "30m",
        refreshExp: "7d",
    })
);

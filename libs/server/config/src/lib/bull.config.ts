import { registerAs } from "@nestjs/config";

export const bullConfig = registerAs("bull", () => ({
  host: process.env["REDIS_HOST"],
}));

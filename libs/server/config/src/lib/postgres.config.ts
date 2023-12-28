import { registerAs } from "@nestjs/config";

export const postgresConfig = registerAs("postgres", () => ({
  database: process.env["POSTGRES_NAME"],
  host: process.env["POSTGRES_HOST"],
  port: process.env["POSTGRES_PORT"],
  user: process.env["POSTGRES_USERNAME"],
  password: process.env["POSTGRES_PASSWORD"],
}));

import { registerAs } from "@nestjs/config";

export const postgresConfig = registerAs("postgres", () => ({
  name: process.env["POSTGRES_NAME"],
  host: process.env["POSTGRES_HOST"],
  port: process.env["POSTGRES_PORT"],
  username: process.env["POSTGRES_USERNAME"],
  password: process.env["POSTGRES_PASSWORD"],
}));

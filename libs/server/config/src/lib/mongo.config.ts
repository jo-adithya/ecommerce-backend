import { registerAs } from "@nestjs/config";

export const mongoConfig = registerAs("mongo", () => ({
  uri: process.env["MONGODB_URI"],
}));

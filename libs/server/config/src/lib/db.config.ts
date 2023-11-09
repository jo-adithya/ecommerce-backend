import { registerAs } from "@nestjs/config";

export const dbConfig = registerAs("db", () => ({
	uri: process.env["MONGODB_URI"],
}));

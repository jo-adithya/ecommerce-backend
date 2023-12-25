import { registerAs } from "@nestjs/config";

export const ordersConfig = registerAs("orders", () => ({
  expirationSeconds: parseInt(process.env["EXPIRATION_WINDOW_SECONDS"] ?? "900", 10),
}));

import { registerAs } from "@nestjs/config";

export const natsConfig = registerAs("nats", () => ({
  url: process.env["NATS_URL"],
  clusterId: process.env["NATS_CLUSTER_ID"],
  clientId: process.env["NATS_CLIENT_ID"],
}));

import { Inject } from "@nestjs/common";

import { NATS_STREAMING_CLIENT } from "./nats-streaming.constants";

export const InjectClient = () => Inject(NATS_STREAMING_CLIENT);

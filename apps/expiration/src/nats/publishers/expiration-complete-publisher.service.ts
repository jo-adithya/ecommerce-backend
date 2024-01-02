import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  ExpirationCompleteEvent,
  InjectClient,
  PublisherService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class ExpirationCompletePublisherService extends PublisherService<ExpirationCompleteEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.ExpirationComplete });
  }
}

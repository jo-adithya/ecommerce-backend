import { Stan } from "node-nats-streaming";

import { Event } from "./events";

export abstract class AbstractPublisherService<T extends Event> {
  private readonly subject: T["subject"];

  constructor(
    private readonly client: Stan,
    options: { subject: T["subject"] },
  ) {
    this.subject = options.subject;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}

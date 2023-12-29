import { Message, Stan } from "node-nats-streaming";

import { OnModuleInit } from "@nestjs/common";

import { Event } from "./events";

export abstract class ListenerService<T extends Event> implements OnModuleInit {
  private readonly subject: T["subject"];
  private readonly queueGroupName: string;
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T["data"], msg: Message): void;

  constructor(
    private readonly client: Stan,
    options: {
      subject: T["subject"];
      queueGroupName: string;
    },
  ) {
    this.subject = options.subject;
    this.queueGroupName = options.queueGroupName;
  }

  onModuleInit() {
    this.listen();
  }

  private listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions(),
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  private subscriptionOptions() {
    const options = this.client.subscriptionOptions();
    options.setDeliverAllAvailable();
    options.setManualAckMode(true);
    options.setAckWait(this.ackWait);
    options.setDurableName(this.queueGroupName);
    return options;
  }

  private parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString("utf8"));
  }
}

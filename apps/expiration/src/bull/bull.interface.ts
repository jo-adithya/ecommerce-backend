import Bull from "bull";

export interface Payload {
  orderId: string;
}

export type BullQueue = Bull.Queue<Payload>;

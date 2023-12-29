import { Subject } from "./subject.interface";

export interface Event {
  subject: Subject;
  data: unknown;
}

export * from "./subject.interface";
export * from "./product-created-event.interface";
export * from "./product-updated-event.interface";

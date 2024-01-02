import { Subject } from "./subject.interface";

export interface ExpirationCompleteEvent {
  subject: Subject.ExpirationComplete;
  data: {
    orderId: string;
  };
}

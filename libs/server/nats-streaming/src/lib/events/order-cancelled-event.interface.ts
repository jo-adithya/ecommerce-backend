import { Subject } from "./subject.interface";

export interface OrderCancelledEvent {
  subject: Subject.OrderCancelled;
  data: {
    version: number;
    id: string;
    quantity: number;
    product: {
      id: string;
    };
  };
}

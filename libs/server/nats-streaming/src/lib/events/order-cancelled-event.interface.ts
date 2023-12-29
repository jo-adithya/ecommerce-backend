import { Subject } from "./subject.interface";

export interface OrderCancelledEvent {
  subject: Subject.OrderCancelled;
  data: {
    id: string;
    quantity: number;
    product: {
      id: string;
    };
  };
}

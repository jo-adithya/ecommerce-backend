import { Subject } from "./subject.interface";

export interface ProductUpdatedEvent {
  subject: Subject.ProductUpdated;
  data: {
    version: number;
    id: string;
    title: string;
    price: number;
    quantity: number;
  };
}

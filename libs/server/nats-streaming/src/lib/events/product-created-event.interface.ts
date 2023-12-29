import { Subject } from "./subject.interface";

export interface ProductCreatedEvent {
  subject: Subject.ProductCreated;
  data: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  };
}

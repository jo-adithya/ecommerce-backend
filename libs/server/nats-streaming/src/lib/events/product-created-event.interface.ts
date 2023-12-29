import { Subject } from "./subject.interface";

export interface ProductCreatedEvent {
  subject: Subject.ProductCreated;
  data: {
    version: number;
    id: string;
    title: string;
    price: number;
    quantity: number;
  };
}

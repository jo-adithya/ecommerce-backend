import { Subject } from "./subject.interface";

export interface ProductUpdatedEvent {
  subject: Subject.ProductUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

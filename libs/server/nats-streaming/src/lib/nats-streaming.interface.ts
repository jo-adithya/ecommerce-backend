export enum Subject {
  ProductCreated = "product:created",
}

export interface Event {
  subject: Subject;
  data: unknown;
}

export interface ProductCreatedEvent {
  subject: Subject.ProductCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

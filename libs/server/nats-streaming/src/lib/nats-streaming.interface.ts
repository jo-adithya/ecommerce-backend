export enum Subject {
  ProductCreated = "product:created",
  ProductUpdated = "product:updated",
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

export interface ProductUpdatedEvent {
  subject: Subject.ProductUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

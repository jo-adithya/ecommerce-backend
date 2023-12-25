export enum OrderStatus {
  // When the order has been created, but the product has not been reserved
  Created = "created",

  // When the order is trying to reserve the product, but it has already been reserved
  // or when the user has cancelled the order
  // or when the order expires before payment
  Cancelled = "cancelled",

  // When the order has successfully reserved the product
  AwaitingPayment = "awaiting:payment",

  // When the user has provided payment successfully
  Complete = "complete",
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {
  getData(): { message: string } {
    return { message: "Hello API" };
  }
}

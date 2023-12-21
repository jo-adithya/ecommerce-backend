import { Controller, Get } from "@nestjs/common";

import { OrdersService } from "./orders.service";

@Controller()
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}

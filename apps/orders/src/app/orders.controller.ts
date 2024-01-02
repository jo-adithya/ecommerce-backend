import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser, JwtAuthGuard, UserDto } from "@nx-micro-ecomm/server/auth";

import { CreateOrderDto } from "./dtos";
import { OrdersService } from "./orders.service";

@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllOrders(@CurrentUser() user: UserDto) {
    return this.ordersService.getAllOrders(user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  getOrderById(@CurrentUser() user: UserDto, @Param("id") orderId: string) {
    return this.ordersService.getOrderById(user.id, orderId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@CurrentUser() user: UserDto, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Patch(":id")
  cancelOrder(@Param("id") orderId: string) {
    return this.ordersService.cancelOrder(orderId);
  }
}

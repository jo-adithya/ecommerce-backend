import { Module } from "@nestjs/common";

import { MongooseModule } from "@nx-micro-ecomm/server/mongoose";

import { User, UserSchema } from "../models/user.schema";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [MongooseModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

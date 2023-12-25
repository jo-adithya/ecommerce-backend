import { Module } from "@nestjs/common";

import { DatabaseModule } from "@nx-micro-ecomm/server/database";

import { User, UserSchema } from "../models/user.schema";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

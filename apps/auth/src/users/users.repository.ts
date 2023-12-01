import { Model } from "mongoose";

import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { AbstractRepository } from "@nx-micro-ecomm/server/database";

import { User } from "../models/user.schema";

export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}

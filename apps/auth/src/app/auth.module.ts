import { Module } from "@nestjs/common";

import { ConfigModule } from "@nx-micro-ecomm/server/config";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";

import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [LoggerModule, ConfigModule, UsersModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

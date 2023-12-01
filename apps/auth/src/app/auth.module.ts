import cookieParser from "cookie-parser";
import Joi from "joi";

import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { jwtConfig } from "@nx-micro-ecomm/server/config";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";

import { HashingService, ScryptService } from "../hashing";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { LocalStrategy } from "../strategies/local.strategy";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
        PORT: Joi.number().required(),
      }),
      load: [jwtConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: HashingService,
      useClass: ScryptService,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ExpirationModule } from "./app/expiration.module";

async function bootstrap() {
  await NestFactory.createApplicationContext(ExpirationModule);
  Logger.log(`🚀 Application is running`);
}

bootstrap();

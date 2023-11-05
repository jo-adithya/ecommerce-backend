import { Logger as PinoLogger } from "nestjs-pino";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { ProductsModule } from "./app/products.module";

async function bootstrap() {
	const app = await NestFactory.create(ProductsModule);
	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix);
	app.useLogger(app.get(PinoLogger));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	const configService = app.get(ConfigService);
	const port = configService.get("PORT") || 3000;
	await app.listen(port);

	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

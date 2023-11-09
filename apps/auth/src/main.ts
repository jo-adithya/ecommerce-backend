import * as cookieParser from "cookie-parser";
import { Logger as PinoLogger } from "nestjs-pino";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AuthModule } from "./app/auth.module";

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	app.use(cookieParser.default());
	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix);
	app.useGlobalPipes(new ValidationPipe());
	app.useLogger(app.get(PinoLogger));

	const configService = app.get(ConfigService);
	const port = configService.get("PORT") || 3001;
	await app.listen(port);

	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

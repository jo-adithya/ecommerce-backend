import * as Joi from "joi";

import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
	imports: [
		NestConfigModule.forRoot({
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
			}),
		}),
	],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class ConfigModule {}

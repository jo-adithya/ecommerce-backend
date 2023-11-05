import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";

import { ConfigModule } from "@nx-micro-ecomm/server/config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get("MONGODB_URI"),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [],
	exports: [],
})
export class DatabaseModule {
	static forFeature(models?: ModelDefinition[] | undefined, connectionName?: string | undefined) {
		return MongooseModule.forFeature(models, connectionName);
	}
}

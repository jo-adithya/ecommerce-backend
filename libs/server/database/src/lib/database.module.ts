import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
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
export class DatabaseModule {}

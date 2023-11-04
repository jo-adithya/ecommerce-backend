import { LoggerModule as PinoLoggerModule } from "nestjs-pino";

import { Module } from "@nestjs/common";

@Module({
	imports: [
		PinoLoggerModule.forRoot({
			pinoHttp: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
					},
				},
			},
		}),
	],
	providers: [],
	exports: [],
})
export class LoggerModule {}

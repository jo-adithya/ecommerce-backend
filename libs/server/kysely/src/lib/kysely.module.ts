import { CamelCasePlugin, Kysely, KyselyConfig, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { Global, Module } from "@nestjs/common";

import { postgresConfig } from "@nx-micro-ecomm/server/config";

import {
  getKyselyConfigToken,
  getKyselyInstanceToken,
  getKyselyModuleOptionsToken,
  getKyselyPoolOptionsToken,
} from "./kysely.constants";
import { KyselyModuleOptions, KyselyPoolOptions } from "./kysely.module-definition";
import { KyselyService } from "./kysely.service";

@Global()
@Module({})
export class KyselyModule {
  static forRoot(options: KyselyModuleOptions) {
    const kyselyInstanceProvider = {
      provide: getKyselyInstanceToken(),
      inject: [getKyselyConfigToken()],
      useFactory: (kyselyConfig: KyselyConfig) => {
        return new Kysely(kyselyConfig);
      },
    };

    return {
      module: KyselyModule,
      providers: [
        {
          provide: getKyselyModuleOptionsToken(),
          useFactory: () => options,
        },
        { provide: getKyselyPoolOptionsToken(), ...postgresConfig.asProvider() },
        {
          provide: getKyselyConfigToken(),
          inject: [getKyselyPoolOptionsToken()],
          useFactory: (kyselyPoolOptions: KyselyPoolOptions): KyselyConfig => ({
            dialect: new PostgresDialect({
              pool: new Pool(kyselyPoolOptions),
            }),
            plugins: [new CamelCasePlugin()],
          }),
        },
        kyselyInstanceProvider,
        KyselyService,
      ],
      exports: [kyselyInstanceProvider],
    };
  }
}

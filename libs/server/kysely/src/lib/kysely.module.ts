import { CamelCasePlugin, Kysely, KyselyConfig, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { Module } from "@nestjs/common";

import { postgresConfig } from "@nx-micro-ecomm/server/config";

import {
  getKyselyConfigToken,
  getKyselyInstanceToken,
  getKyselyModuleOptionsToken,
} from "./kysely.constants";
import { KyselyModuleOptions } from "./kysely.module-definition";

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: getKyselyModuleOptionsToken(), ...postgresConfig.asProvider() },
    {
      provide: getKyselyConfigToken(),
      inject: [getKyselyModuleOptionsToken()],
      useFactory: (kyselyModuleOptions: KyselyModuleOptions): KyselyConfig => ({
        dialect: new PostgresDialect({
          pool: new Pool(kyselyModuleOptions),
        }),
        plugins: [new CamelCasePlugin()],
      }),
    },
    {
      provide: getKyselyInstanceToken(),
      inject: [getKyselyConfigToken()],
      useFactory: (kyselyConfig: KyselyConfig) => {
        return new Kysely(kyselyConfig);
      },
    },
  ],
  exports: [getKyselyInstanceToken()],
})
export class KyselyModule {}

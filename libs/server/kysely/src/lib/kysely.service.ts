import { promises as fs } from "fs";
import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import * as path from "path";

import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { getKyselyModuleOptionsToken } from "./kysely.constants";
import { InjectKysely } from "./kysely.decorator";
import { KyselyModuleOptions } from "./kysely.module-definition";

@Injectable()
export class KyselyService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KyselyService.name);

  constructor(
    @InjectKysely() private readonly db: Kysely<Record<string, Record<string, unknown>>>,
    @Inject(getKyselyModuleOptionsToken()) private readonly options: KyselyModuleOptions,
  ) {}

  async onModuleInit() {
    await this.migrateToLatest();
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }

  private async migrateToLatest() {
    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: this.options.migrationFolder,
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((migration) => {
      if (migration.status === "Success") {
        this.logger.log(`migration "${migration.migrationName}" was executed successfully`);
      } else if (migration.status === "Error") {
        this.logger.error(`failed to execute migration "${migration.migrationName}"`);
      }
    });

    if (error) {
      this.logger.error("failed to migrate");
      this.logger.error(error);
      process.exit(1);
    }
  }
}

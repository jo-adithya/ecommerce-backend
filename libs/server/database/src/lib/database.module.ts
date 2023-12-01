import { Module } from "@nestjs/common";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";

import { dbConfig } from "@nx-micro-ecomm/server/config";

@Module({
  imports: [MongooseModule.forRootAsync(dbConfig.asProvider())],
  providers: [],
  exports: [],
})
export class DatabaseModule {
  static forFeature(models?: ModelDefinition[] | undefined, connectionName?: string | undefined) {
    return MongooseModule.forFeature(models, connectionName);
  }
}

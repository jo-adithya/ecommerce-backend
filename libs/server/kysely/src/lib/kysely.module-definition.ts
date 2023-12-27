import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface KyselyModuleOptions {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export type NatsStreamingModuleAsyncOptions = Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider<KyselyModuleOptions>, "inject" | "useFactory">;

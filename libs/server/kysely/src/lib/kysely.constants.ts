const KYSELY_MODULE_OPTIONS = "KYSELY_MODULE_OPTIONS";
const KYSELY_CONFIG = "KYSELY_CONFIG";
const KYSELY_INSTANCE = "KYSELY_INSTANCE";

export const getKyselyConfigToken = () => KYSELY_CONFIG;
export const getKyselyInstanceToken = () => KYSELY_INSTANCE;
export const getKyselyModuleOptionsToken = () => KYSELY_MODULE_OPTIONS;

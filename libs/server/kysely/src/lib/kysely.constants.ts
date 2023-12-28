const KYSELY_MODULE_OPTIONS = "KYSELY_MODULE_OPTIONS";
const KYSELY_POOL_OPTIONS = "KYSELY_POOL_OPTIONS";
const KYSELY_CONFIG = "KYSELY_CONFIG";
const KYSELY_INSTANCE = "KYSELY_INSTANCE";

export const getKyselyConfigToken = () => KYSELY_CONFIG;
export const getKyselyInstanceToken = () => KYSELY_INSTANCE;
export const getKyselyPoolOptionsToken = () => KYSELY_POOL_OPTIONS;
export const getKyselyModuleOptionsToken = () => KYSELY_MODULE_OPTIONS;

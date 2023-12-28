import { Inject } from "@nestjs/common";

import { getKyselyInstanceToken } from "./kysely.constants";

export const InjectKysely = () => Inject(getKyselyInstanceToken());

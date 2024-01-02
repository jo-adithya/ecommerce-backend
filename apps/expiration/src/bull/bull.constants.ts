import { Inject } from "@nestjs/common";

const BULL_QUEUE = "BULL_QUEUE";
export const getBullQueueToken = () => BULL_QUEUE;

export const InjectQueue = () => Inject(getBullQueueToken());

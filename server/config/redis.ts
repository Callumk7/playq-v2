import type { ConnectionOptions } from "bullmq";
import { env } from "~/lib/env";

export const redisConfig: ConnectionOptions = {
	url: env.REDIS_URL,
};

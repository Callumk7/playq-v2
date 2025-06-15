import type { ConnectionOptions } from "bullmq";
import { env } from "~/lib/env";

export const redisConfig: ConnectionOptions = {
	host: env.REDIS_HOST || "localhost",
	port: env.REDIS_PORT || 6379,
	password: env.REDIS_PASSWORD,
	db: env.REDIS_DB || 0,
};

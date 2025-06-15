import type { ConnectionOptions } from "bullmq";
import { env } from "~/lib/env";

const redisURL = new URL(env.REDIS_URL);

export const redisConfig: ConnectionOptions = {
	family: 0,
	host: redisURL.hostname,
	port: Number(redisURL.port),
	username: redisURL.username,
	password: redisURL.password,
};

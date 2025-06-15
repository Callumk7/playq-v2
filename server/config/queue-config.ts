import { redisConfig } from "./redis";

export const queueConfig = {
	connection: redisConfig,
	defaultJobOptions: {
		removeOnComplete: 100,
		removeOnFail: 20,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	},
};

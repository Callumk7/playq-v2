import { Queue } from "bullmq";
import { queueConfig } from "server/config/queue-config";

export const dbQueue = new Queue("db", queueConfig);
export const notificationQueue = new Queue("notifications", queueConfig);

// Queue Registry
export const queues = {
	db: dbQueue,
	notifications: notificationQueue,
};

export const addSaveGameJob = (gameId: number, priority = 0) => {
	return dbQueue.add(
		"save-game",
		{ gameId },
		{
			priority,
			// Prevent duplicate jobs for the same game
			jobId: `save-game-${gameId}`,
		},
	);
};

Object.values(queues).forEach((queue) => {
	queue.on("error", (err) => {
		console.error(`Job error: ERROR: ${err.name}, MESSAGE: ${err.message}`);
	});
});

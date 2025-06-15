import { dbWorker } from "./db-worker";

export const workers = [
	dbWorker,
	// Add other workers here
];

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("🛑 Shutting down workers...");

	await Promise.all(workers.map((worker) => worker.close()));

	console.log("✅ All workers shut down");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("🛑 Received SIGTERM, shutting down workers...");
	await Promise.all(workers.map((worker) => worker.close()));
	process.exit(0);
});

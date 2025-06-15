import { type Job, Worker } from "bullmq";
import { queueConfig } from "server/config/queue-config";
import { db } from "~/db/index.server";
import { createGame, getGameById } from "~/db/queries/games";
import { genresToGames } from "~/db/schema/genres";
import { validateAndMapGame } from "~/schema/igdb";
import { getFullGame } from "~/services/igdb.server";

const jobProcessors = {
	"save-game": saveGameToDb,
};

export const dbWorker = new Worker(
	"db",
	async (job) => {
		const processor = jobProcessors[job.name as keyof typeof jobProcessors];

		if (!processor) {
			throw new Error(`Unknown job type: ${job.name}`);
		}

		return await processor(job);
	},
	{
		...queueConfig,
		concurrency: 15,
	},
);

async function saveGameToDb(job: Job<{ gameId: number }>) {
	const { gameId } = job.data;
	console.log(`Processing save-game job for gameId: ${gameId}`);

	// ===== APPLICATION-LEVEL CHECK =====
	const existingGame = await getGameById(gameId);
	if (existingGame) {
		// Optional: You could even check an `updatedAt` field
		// to see if your data is stale and needs a refresh.
		console.log(`Skipping gameId ${gameId}: Already exists in DB.`);
		return { success: true, status: "skipped", gameId };
	}
	// ===================================

	try {
		// Update progress
		await job.updateProgress(10);

		const fetchedGame = await getFullGame(gameId);
		await job.updateProgress(40);

		console.log("Now validating game data for the database..");
		const validGame = validateAndMapGame(fetchedGame);
		await job.updateProgress(60);

		await createGame(validGame);
		await job.updateProgress(80);

		if (validGame.genres) {
			console.log("found game genres, linking..");
			for (const genre of validGame.genres) {
				await db
					.insert(genresToGames)
					.values({
						gameId: gameId,
						genreId: genre,
					})
					.onConflictDoNothing();
				console.log(`Added genre ${genre} to game ${gameId}`);
			}
		}

		await job.updateProgress(100);

		return {
			success: true,
			gameId,
			genresLinked: validGame.genres?.length || 0,
		};
	} catch (error) {
		console.error("Failed to save game:", error);
		throw error;
	}
}

dbWorker.on("ready", () => {
	console.log("🎮 DB worker is ready");
});

dbWorker.on("error", (err) => {
	console.error("🎮 DB worker error:", err);
});

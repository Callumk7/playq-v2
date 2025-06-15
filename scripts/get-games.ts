import "dotenv/config";
import { db } from "~/db/index.server";
import { genres } from "~/db/schema/genres";
import { getAllGenres } from "~/services/igdb.server";

const allGenres = await getAllGenres();
console.log(allGenres);

console.log("saving genres to db...");

for (const genre of allGenres) {
	const { id, name } = genre;
	await db
		.insert(genres)
		.values({ id, name })
		.onConflictDoNothing()
		.catch((reason) => console.error(`${name} had an error: ${reason}`))
		.finally(() => console.log(`${name} processed`));
}

import { db } from "../index.server";
import { genres } from "../schema/genres";

export async function getAllGenres() {
	return await db.select().from(genres);
}

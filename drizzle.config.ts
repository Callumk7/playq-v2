
import type { Config } from "drizzle-kit";

export default {
	schema: "./app/db/schema/*",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DB_URL!
	}
} satisfies Config;

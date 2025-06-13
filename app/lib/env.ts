import { config } from "dotenv";

config();

if (!process.env.IGDB_CLIENT_ID) {
	throw new Error("IGDB_CLIENT_ID is not defined");
}
if (!process.env.IGDB_BEARER_TOKEN) {
	throw new Error("IGDB_BEARER_TOKEN is not defined");
}
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}
if (!process.env.BETTER_AUTH_SECRET) {
	throw new Error("BETTER_AUTH_SECRET is not defined");
}
if (!process.env.BETTER_AUTH_URL) {
	throw new Error("BETTER_AUTH_URL is not defined");
}
if (!process.env.API_GATEWAY_URL) {
	throw new Error("API_GATEWAY_URL is not defined");
}
if (!process.env.API_GATEWAY_KEY) {
	throw new Error("API_GATEWAY_KEY is not defined");
}
if (!process.env.DISCORD_BOT_TOKEN) {
	throw new Error("DISCORD_BOT_TOKEN is not defined");
}

export const env = {
	IGDB_CLIENT_ID: process.env.IGDB_CLIENT_ID,
	IGDB_BEARER_TOKEN: process.env.IGDB_BEARER_TOKEN,
	API_GATEWAY_URL: process.env.API_GATEWAY_URL,
	API_GATEWAY_KEY: process.env.API_GATEWAY_KEY,
	DATABASE_URL: process.env.DB_URL,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
};

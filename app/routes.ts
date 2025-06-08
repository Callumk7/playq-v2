import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	// Auth wrapper around the whole app
	layout("./routes/auth/layout.tsx", [
		// Application specific layout
		layout("./routes/base-layout.tsx", [
			index("routes/home.tsx"),
			route("explore", "./routes/explore/layout.tsx", [
				// Search for games
				route("games", "./routes/explore/games.tsx"),
				// Top rated games by genre
				...prefix("top-rated", [
					route("all", "./routes/explore/top-rated/all.tsx"),
					route(":genreId", "./routes/explore/top-rated/$genre.tsx"),
				]),
				// Most hyped games
				route("hyped", "./routes/explore/hyped.tsx"),
				route("playlists", "./routes/explore/playlists/index.tsx"),
				route(
					"playlists/:playlistId",
					"./routes/explore/playlists/$playlistId.tsx",
				),
			]),
			route("collection", "./routes/collection/layout.tsx", [
				route("games", "./routes/collection/games.tsx", { id: "collection" }),
				route("playlists", "./routes/collection/playlists/layout.tsx", [
					index("./routes/collection/playlists/index.tsx"),
					route(":playlistId", "./routes/collection/playlists/playlist.tsx"),
					route("new", "./routes/collection/playlists/new.tsx"),
				]),
			]),
			route("games/:gameId", "./routes/games/game.tsx"),
			route("account", "./routes/account.tsx"),
			route("discord", "./routes/discord.tsx"),
			route("steam", "./routes/steam.tsx"),
		]),
	]),
	...prefix("api", [
		route("auth/*", "./routes/api/auth.ts"),
		route("collection", "./routes/api/collection/index.ts"),
		route("collection/:userId", "./routes/api/collection/$userId.ts"),
		route("playlists", "./routes/api/playlists.ts"),
		route("playlists/:playlistId", "./routes/api/playlistGames.ts"),
		route("steam", "./routes/api/steam.ts"),
	]),
	route("auth/signup", "./routes/auth/signup.tsx"),
	route("auth/login", "./routes/auth/login.tsx"),
] satisfies RouteConfig;

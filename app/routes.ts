import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	// Auth wrapper around the whole app
	layout("./routes/auth/layout.tsx", [
		// Application specific layout
		layout("./routes/base-layout.tsx", [
			index("routes/home.tsx"),
			route("explore", "./routes/explore/layout.tsx", [
				route("games", "./routes/explore/games.tsx"),
				route("playlists", "./routes/explore/playlists.tsx"),
				...prefix("top-rated", [
					route("all", "./routes/explore/top-rated/all.tsx"),
					route(":genreId", "./routes/explore/top-rated/$genre.tsx"),
				]),
				route("hyped", "./routes/explore/hyped.tsx"),
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
		]),
	]),
	...prefix("api", [
		route("auth/*", "./routes/api/auth.ts"),
		route("collection", "./routes/api/collection.ts"),
		route("playlists", "./routes/api/playlists.ts"),
		route("playlists/:playlistId", "./routes/api/playlistGames.ts"),
	]),
	route("auth/signup", "./routes/auth/signup.tsx"),
	route("auth/login", "./routes/auth/login.tsx"),
] satisfies RouteConfig;

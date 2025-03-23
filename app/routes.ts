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
			]),
			...prefix("collection", [
				route("games", "./routes/collection/games.tsx"),
				route("playlists", "./routes/collection/playlists/layout.tsx", [
					index("./routes/collection/playlists/index.tsx"),
					route(":playlistId", "./routes/collection/playlists/playlist.tsx"),
				])
			])
		]),
	]),
	...prefix("api", [
		route("auth/*", "./routes/api/auth.ts"),
		route("collection", "./routes/api/collection.ts"),
		route("playlists", "./routes/api/playlists.ts")
	]),
	route("auth/signup", "./routes/auth/signup.tsx"),
	route("auth/login", "./routes/auth/login.tsx"),
] satisfies RouteConfig;

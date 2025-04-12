import { v } from "convex/values";
import { query } from "../_generated/server";

export const getComments = query({
	args: { playlistId: v.string() },
	handler: async (ctx, args) => {
		const messages = await ctx.db
			.query("playlist_comments")
			.withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
			.order("desc")
			.collect();

		return messages.reverse();
	},
});

import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const postComment = mutation({
	args: {
		playlistId: v.string(),
		userId: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("playlist_comments", {
			userId: args.userId,
			playlistId: args.playlistId,
			content: args.content,
		});
	},
});

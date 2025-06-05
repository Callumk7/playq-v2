import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	playlist_comments: defineTable({
		userId: v.string(),
		playlistId: v.string(),
		content: v.string()
	}).index("by_playlist", ["playlistId"])
})

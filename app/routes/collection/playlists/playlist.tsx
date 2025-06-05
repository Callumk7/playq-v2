import { getAndValidateSession } from "~/lib/auth/helpers";
import {
	addGamesToPlaylist,
	deletePlaylist,
	getGamesInPlaylist,
	getPlaylistById,
	updatePlaylist,
} from "~/db/queries/playlist";
import { redirect } from "react-router";
import { LibraryView } from "~/components/library/library-view";
import type { Route } from "./+types/playlist";
import { PlaylistMenu } from "./components/playlist-menu";
import { CollectionGame } from "~/components/library/collection-game-item";
import { parseForm, zx } from "zodix";
import { playlistsInsertSchema } from "~/db/schema/playlists";
import { CommentsLayout } from "~/components/layout/comments-sidebar";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useAuth } from "~/components/context/auth";
import { withLoaderLogging, withActionLogging } from "~/lib/route-logger.server";

const playlistLoader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);
	const { playlistId } = params;
	if (!playlistId) {
		throw redirect("/collection/playlists");
	}

	const playlist = await getPlaylistById(playlistId);

	if (!playlist) {
		throw redirect("/collection/playlists");
	}

	// if (playlist.creatorId !== session.user.id) {
	// 	throw redirect("/collection/playlists");
	// }

	const playlistGames = await getGamesInPlaylist(playlistId);

	return { playlist, playlistGames };
};

// TODO: Authorisation on this delete action
const playlistAction = async ({ request, params }: Route.ActionArgs) => {
	const { playlistId } = params;

	if (request.method === "POST") {
		const { gameId } = await parseForm(request, {
			gameId: zx.NumAsString,
		});
		return await addGamesToPlaylist(playlistId, [gameId]);
	}

	if (request.method === "PUT") {
		const data = await parseForm(
			request,
			playlistsInsertSchema
				.omit({
					id: true,
					creatorId: true,
					createdAt: true,
					updatedAt: true,
				})
				.partial(),
		);

		return await updatePlaylist(playlistId, data);
	}

	if (request.method === "DELETE") {
		return await deletePlaylist(playlistId);
	}

	return null;
};

export const loader = withLoaderLogging("collection/playlists/playlist", playlistLoader);
export const action = withActionLogging("collection/playlists/playlist", playlistAction);

export default function PlaylistPage({ loaderData }: Route.ComponentProps) {
	const { playlist, playlistGames } = loaderData;
	const session = useAuth();
	return (
		<CommentsLayout
			commentsSlot={<SampleComments userId={session.user.id} playlistId={playlist.id} />}
		>
			<PlaylistMenu playlistId={playlist.id} privacySetting={playlist.privacySetting} />
			<LibraryView>
				{playlistGames?.map((game) => (
					// TODO: Make a playlist game item component?
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
					/>
				))}
			</LibraryView>
		</CommentsLayout>
	);
}

interface SampleCommentsProps {
	userId: string;
	playlistId: string;
}
function SampleComments({ userId, playlistId }: SampleCommentsProps) {
	const [content, setContent] = useState("");
	const postComment = useMutation(api.comments.mutations.postComment);

	const comments = useQuery(api.comments.queries.getComments, { playlistId });
	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-semibold">Comments</h2>
			{comments?.map((comment) => (
				<div
					key={comment._id}
					className={`flex ${comment.userId === userId ? "justify-end" : "justify-start"} mb-4`}
				>
					<div
						className={`max-w-[70%] ${comment.userId === userId ? "order-1" : "order-0"}`}
					>
						<div
							className={`relative px-4 py-2 rounded-lg ${
								comment.userId === userId
									? "bg-primary text-primary-foreground rounded-br-none"
									: "bg-gray-100 text-gray-800 rounded-bl-none"
							}`}
						>
							<p className="text-sm">{comment.content}</p>
							<span className="block text-xs mt-1 opacity-70">{comment.userId}</span>
						</div>
					</div>
				</div>
			))}

			<form
				className="space-y-2"
				onSubmit={async (e) => {
					e.preventDefault();
					await postComment({ userId, playlistId, content });
          setContent("");
				}}
			>
				<Textarea value={content} onInput={(e) => setContent(e.currentTarget.value)} />
				<Button type="submit">Send</Button>
			</form>
		</div>
	);
}

export const handle = {
	breadcrumb: "Playlist",
};

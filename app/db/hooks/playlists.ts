import { useFetcher } from "react-router";

export const useDeletePlaylist = (playlistId: string) => {
	const fetcher = useFetcher();

	const handleDelete = () => {
		fetcher.submit(null, {
			method: "delete",
			action: `/collection/playlists/${playlistId}`,
		});
	};

	return {
		handleDelete,
		isDeleting: fetcher.state === "submitting",
		isDeleted: fetcher.state === "idle" && fetcher.data,
	};
};

export const useAddGamesToPlaylist = (playlistId: string) => {
	const fetcher = useFetcher();

	const handleAddGame = (gameId: number) => {
		fetcher.submit(
			{ gameId },
			{
				method: "post",
				action: `/collection/playlists/${playlistId}`,
			},
		);
	};

	return { handleAddGame, isAdding: fetcher.state === "submitting" };
};

// TODO: This wont work as this route's delete method is used for deleting playlists
// I should instead make an api route for handling this specific thing
export const useRemoveGameFromPlaylist = (playlistId: string) => {
	const fetcher = useFetcher();

	const handleRemoveGame = (gameId: number) => {
		fetcher.submit(
			{ gameId },
			{
				method: "delete",
				action: `/api/playlists/${playlistId}`,
			},
		);
	};

	return { handleRemoveGame, isRemoving: fetcher.state === "submitting" };
};

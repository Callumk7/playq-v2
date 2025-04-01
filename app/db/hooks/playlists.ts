import { useFetcher } from "react-router";
import type { UpdatePlaylist } from "../queries/playlist";

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

export const useUpdatePlaylist = (playlistId: string) => {
	const fetcher = useFetcher();

	const handleUpdatePlaylist = (data: UpdatePlaylist) => {
		fetcher.submit(data, {
			method: "put",
			action: `/collection/playlists/${playlistId}`,
		});
	}

	return {
		handleUpdatePlaylist,
		isUpdating: fetcher.state === "submitting",
	}
}

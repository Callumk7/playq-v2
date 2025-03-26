import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export const useDeleteGameFromCollection = (args: {userId: string, gameId: number}) => {
	const fetcher = useFetcher();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = () => {
		fetcher.submit({...args}, {
			method: "delete",
			action: "/collection/games"
		})
	}

	useEffect(() => {
		if (fetcher.state === "submitting" && !fetcher.data) {
			setIsDeleting(true);
		}
	})

	return {
		handleDelete,
		isDeleting,
		isDeleted: fetcher.data
	}
}

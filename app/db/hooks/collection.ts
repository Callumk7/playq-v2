import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export const useAddGameToCollection = (userId: string) => {
	const fetcher = useFetcher();
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [showTick, setShowTick] = useState(false);

	const handleAdd = (gameId: number) => {
		fetcher.submit(
			{ userId, gameId },
			{
				method: "post",
				action: "/api/collection",
			},
		);
	};

	useEffect(() => {
		if (fetcher.state === "submitting" && !fetcher.data) {
			setIsAdding(true);
		} else if (fetcher.state === "idle" && fetcher.data?.success) {
			setIsAdding(false);
			setIsAdded(true);
			setShowTick(true);

			const timer = setTimeout(() => {
				setShowTick(false);
			}, 1500);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [fetcher.state, fetcher.data]);

	return {
		handleAdd,
		isAdding,
		isAdded,
		showTick,
	};
};

export const useDeleteGameFromCollection = (args: { userId: string; gameId: number }) => {
	const fetcher = useFetcher();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = () => {
		fetcher.submit(
			{ ...args },
			{
				method: "delete",
				action: "/collection/games",
			},
		);
	};

	useEffect(() => {
		if (fetcher.state === "submitting" && !fetcher.data) {
			setIsDeleting(true);
		}
	});

	return {
		handleDelete,
		isDeleting,
		isDeleted: fetcher.data,
	};
};

import { useAddGameToCollection } from "~/db/hooks/collection";
import { useAuth } from "../context/auth";
import { Button } from "../ui/button";
import { CheckIcon, RefreshCwIcon, SaveIcon, TrainIcon } from "lucide-react";

interface SaveSearchResultButtonProps {
	gameId: number;
}
export function SaveSearchResultButton({ gameId }: SaveSearchResultButtonProps) {
	const { user } = useAuth();

	const { handleAdd, isAdded, isAdding, showTick } = useAddGameToCollection(user.id);

	return (
		<Button size={"icon"} variant={"outline"} onClick={() => handleAdd(gameId)}>
			{isAdding ? (
				<RefreshCwIcon className="animate-spin" />
			) : showTick ? (
				<CheckIcon />
			) : isAdded ? (
				<TrainIcon />
			) : (
				<SaveIcon />
			)}
		</Button>
	);
}

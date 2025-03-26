import { Button } from "../ui/button";
import {
    CheckIcon, RefreshCwIcon,
    SaveIcon,
    TrainIcon
} from "lucide-react";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { CoverImage } from "./base-game-item";

interface ExploreGameProps {
	coverId: string | null;
	name: string;
	gameId: number;
}
export function ExploreGame({ coverId, name, gameId }: ExploreGameProps) {
	const fetcher = useFetcher();
	const status = fetcher.state;

	const [showTick, setShowTick] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (status === "submitting") {
			setIsLoading(true);
		} else if (status === "idle" && fetcher.data?.success) {
			setIsLoading(false);
			setShowTick(true);
			setIsComplete(true);

			const timer = setTimeout(() => {
				setShowTick(false);
			}, 1500);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [status, fetcher.data]);

	const handleSave = async () => {
		// TODO: there is a better-auth method for doing this
		const userId = localStorage.getItem("userId");
		fetcher.submit({ userId, gameId }, { method: "POST", action: "/api/collection" });
	};

	return (
		<div className="group hover:bg-muted p-2 h-full rounded-md">
			<CoverImage imageId={coverId} />
			<div className="w-full flex justify-between py-2">
				<p className="text-sm">{name}</p>
				<Button
					size={"icon"}
					onClick={handleSave}
					className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out"
				>
					{isLoading ? (
						<RefreshCwIcon className="animate-spin" />
					) : showTick ? (
						<CheckIcon className="animate-pulse" />
					) : isComplete ? (
						<TrainIcon />
					) : (
						<SaveIcon />
					)}
				</Button>
			</div>
		</div>
	);
}

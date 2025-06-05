import { CogIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Game } from "~/db/queries/games";

interface GameDebugProps {
	game: Game;
}

export function GameDebug({ game }: GameDebugProps) {
	return (
		<Dialog>
			<DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Button size={"icon"}>
					<CogIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<ScrollArea className="h-60">
					<div className="whitespace-pre-wrap">{JSON.stringify(game, null, "\t")}</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

import { cn } from "~/lib/utils";

interface CoverImageProps {
	imageId: string | null;
	className?: string;
}
// This component simply renders the image cover art that we retrieve from IGDB
export function CoverImage({ imageId, className }: CoverImageProps) {
	const size = "720p";
	return (
		<div className="rounded-md overflow-hidden h-fit w-full">
			{imageId ? (
				<img
					src={`https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`}
					alt="game cover art"
					className={cn(className, "h-fit w-full")}
				/>
			) : (
				<PlaceholderImage />
			)}
		</div>
	);
}

// The placeholder div, when no image id is provided
function PlaceholderImage() {
	return (
		<div className="bg-slate-200 w-full aspect-[3/4] flex items-center justify-center rounded-md">
			<span className="text-slate-400">No Image</span>
		</div>
	);
}


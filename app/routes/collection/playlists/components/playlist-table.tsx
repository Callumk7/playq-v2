import { Link } from "react-router";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Playlist } from "~/db/queries/playlist";

interface PlaylistTableProps {
	playlists: Playlist[];
}

export function PlaylistTable({ playlists }: PlaylistTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>
							<Link to={playlist.id} className="text-sm text-blue-600">
								{playlist.name}
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

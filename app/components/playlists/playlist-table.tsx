import { Link } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "~/components/ui/table";
import type { Playlist } from "~/db/queries/playlist";

interface PlaylistTableProps {
	playlists: Playlist[];
}

export function PlaylistTable({ playlists }: PlaylistTableProps) {
	return (
		<Table>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>
							<Link to={playlist.id}>
								{playlist.name}
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

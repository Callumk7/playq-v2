import type { Playlist } from "~/db/queries/playlist";
import { TableBody, TableCell, TableRow, Table } from "../ui/table";
import { Link } from "../ui/button";

interface ExplorePlaylistTableProps {
	playlists: Playlist[];
}
export function ExplorePlaylistsTable({ playlists }: ExplorePlaylistTableProps) {
	return (
		<Table>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>
							<Link to={`/explore/playlists/${playlist.id}`}>{playlist.name}</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { IGDBGame } from "~/schema/igdb";
import { BaseTable } from "../base-table";
import { SaveSearchResultButton } from "./search-results-button";

interface SearchResultsTableProps {
	games: IGDBGame[];
}

const h = createColumnHelper<IGDBGame>();

export function SearchResultsTable({ games }: SearchResultsTableProps) {
	const columns = useMemo(() => {
		const columns = [
			h.accessor("name", {
				header: "Name",
				cell: (info) => info.getValue(),
			}),
			h.accessor("total_rating", {
				header: "Rating",
				cell: (info) => {
					if (info.getValue()) {
						return Math.floor(info.getValue() || 0);
					}
					return "Not Rated";
				},
			}),
			h.accessor("first_release_date", {
				header: "Year",
				cell: (info) => {
					if (info.getValue()) {
						return new Date(Number(info.getValue()) * 1000).getFullYear();
					}
				},
			}),
			h.display({
				id: "actions",
				header: "",
				cell: ({ row }) => {
					return <SaveSearchResultButton gameId={row.original.id} />;
				},
			}),
		];
		return columns;
	}, []);

	const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);

	const table = useReactTable({
		columns,
		data: games,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: { sorting },
	});

	return <BaseTable table={table} />;
}

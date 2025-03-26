import type { Game } from "~/db/queries/games";
import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { BaseTable } from "../base-table";

const h = createColumnHelper<Game>();

interface GameTableProps {
	games: Game[];
}
export function GameTable({ games }: GameTableProps) {
	const columns = useMemo(() => {
		const columns = [
			h.accessor("name", {
				header: "Name",
				cell: (info) => info.getValue(),
			}),
      h.accessor("rating", {
        header: "Rating",
        cell: (info) => info.getValue()
      })
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
		state: {
			sorting,
		},
	});

	return <BaseTable table={table} />;
}

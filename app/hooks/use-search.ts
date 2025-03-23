import { useState } from "react";

interface HasName {
	name: string;
}

export const useSearch = <G extends HasName>(games: G[]) => {
	const [searchTerm, setSearchTerm] = useState("");

	let output: G[] = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	const searchedGames = output;

	return {
		searchedGames,
		searchTerm,
		setSearchTerm
	};
};

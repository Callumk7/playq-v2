import { useState, useEffect } from "react";

interface HasName {
  name: string;
}

export const useSearch = <G extends HasName>(games: G[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedGames, setSearchedGames] = useState<G[]>(games || []);

  useEffect(() => {
    let output: G[] = [...(games || [])];
    if (searchTerm !== "") {
      output = output.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchedGames(output);
  }, [searchTerm, games]);

  return {
    searchedGames,
    searchTerm,
    setSearchTerm
  };
};

import { useNavigate } from "react-router";
import { Tag, TagToggle } from "../ui/tag-group";
import { useState } from "react";

interface GenreSelectorProps {
	genres: { name: string; id: number }[];
	filteredGenres: number[];
	handleGenreToggled: (genreId: number) => void;
	handleToggleAllGenres: () => void;
}
export function GenreSelector({
	genres,
	filteredGenres,
	handleGenreToggled,
	handleToggleAllGenres,
}: GenreSelectorProps) {
	return (
		<GenreTags
			genres={genres}
			activeGenres={filteredGenres}
			handleGenreClicked={handleGenreToggled}
			handleAllClicked={handleToggleAllGenres}
		/>
	);
}

export const useGenreSelector = (allGenres: { name: string; id: number }[]) => {
	const [filteredGenres, setFilteredGenres] = useState<number[]>([]);

	const handleGenreToggled = (genreId: number) => {
		if (filteredGenres.includes(genreId)) {
			setFilteredGenres(filteredGenres.filter((g) => g !== genreId));
		} else {
			setFilteredGenres([...filteredGenres, genreId]);
		}
	};

	const handleToggleAllGenres = () => {
		if (filteredGenres.length > 0) {
			setFilteredGenres([]);
		} else {
			setFilteredGenres(allGenres.map((genre) => Number(genre)));
		}
	};

  return {
    filteredGenres,
    handleGenreToggled,
    handleToggleAllGenres
  }
};

interface GenreNavigationProps {
	genres: { name: string; id: number }[];
	selectedGenreId?: number;
}
export function GenreNavigation({ genres, selectedGenreId }: GenreNavigationProps) {
	const navigate = useNavigate();
	return (
		<GenreTags
			genres={genres}
			activeGenres={selectedGenreId ? [selectedGenreId] : []}
			handleGenreClicked={(genreId) => navigate(`/explore/top-rated/${genreId}`)}
			handleAllClicked={() => navigate("/explore/top-rated/all")}
		/>
	);
}

interface GenreTagsProps {
	genres: { name: string; id: number }[];
	activeGenres: number[];
	handleGenreClicked: (genreId: number) => void;
	handleAllClicked: () => void;
}
function GenreTags({
	genres,
	activeGenres,
	handleGenreClicked,
	handleAllClicked,
}: GenreTagsProps) {
	return (
		<div className="flex flex-wrap gap-2 self-start">
			<button type="button" onClick={handleAllClicked}>
				<Tag variant={activeGenres.length === genres.length ? "primary" : "secondary"}>
					All
				</Tag>
			</button>
			{genres.map((genre) => (
				<button type="button" onClick={() => handleGenreClicked(genre.id)} key={genre.id}>
					<Tag
						variant={activeGenres.includes(genre.id) ? "primary" : "default"}
						key={genre.id}
					>
						{genre.name}
					</Tag>
				</button>
			))}
		</div>
	);
}

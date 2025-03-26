import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type SortOption =
	| "nameAsc"
	| "nameDesc"
	| "releaseDateAsc"
	| "releaseDateDesc"
	| "ratingAsc"
	| "ratingDesc"
	| "aggregatedRatingAsc"
	| "aggregatedRatingDesc"
	| "aggregatedRatingCountAsc"
	| "aggregatedRatingCountDesc"
	| "playerRatingAsc"
	| "playerRatingDesc"
	| "dateAddedAsc"
	| "dateAddedDesc"
	| "followersAsc"
	| "followersDesc";

interface SortState {
	sortOption: SortOption;
	setSortOption: (sortOption: SortOption) => void;
	handleToggleSortDateAdded: () => void;
	handleToggleSortReleaseDate: () => void;
	handleToggleSortAggRating: () => void;
	handleToggleSortAggRatingCount: () => void;
	handleToggleSortFollows: () => void;
	handleToggleSortRating: () => void;
	handleToggleSortName: () => void;
	handleTogglePlayerRating: () => void;
}

interface FilterState {
	genreFilter: string[];
	setGenreFilter: (genreFilter: string[]) => void;
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	filterOnPlayed: boolean;
	setFilterOnPlayed: (filter: boolean) => void;
	handleToggleFilterOnPlayed: () => void;
	filterOnUnPlayed: boolean;
	setFilterOnUnPlayed: (filter: boolean) => void;
	handleToggleFilterOnUnPlayed: () => void;
	filterOnCompleted: boolean;
	setFilterOnCompleted: (filter: boolean) => void;
	handleToggleFilterOnCompleted: () => void;
	filterOnUnCompleted: boolean;
	setFilterOnUnCompleted: (filter: boolean) => void;
	handleToggleFilterOnUnCompleted: () => void;
	filterOnRated: boolean;
	setFilterOnRated: (filter: boolean) => void;
	handleToggleFilterOnRated: () => void;
	filterOnUnrated: boolean;
	setFilterOnUnRated: (filter: boolean) => void;
	handleToggleFilterOnUnrated: () => void;
	filterOnStarred: boolean;
	setFilterOnStarred: (filter: boolean) => void;
	handleToggleFilterOnStarred: () => void;
}

interface ViewState {
	isTableView: boolean;
	setIsTableView: (isTableView: boolean) => void;
	handleToggleView: () => void;
}

interface UserCollectionStore extends SortState, FilterState, ViewState {
	selectedGameId: number | null;
	setSelectedGameId: (gameId: number | null) => void;
	selectGame: (gameId: number) => void;
	isGameSheetOpen: boolean;
	setIsGameSheetOpen: (isOpen: boolean) => void;
}

export const useCollectionStore = create<UserCollectionStore>()((set) => ({
	genreFilter: [],
	searchTerm: "",
	sortOption: "ratingDesc",
	isTableView: false,
	hideProgress: false,
	selectModeOn: false,
	selectedGames: [],
	filterOnPlayed: false,
	filterOnUnPlayed: false,
	filterOnCompleted: false,
	filterOnUnCompleted: false,
	filterOnRated: false,
	filterOnUnrated: false,
	filterOnStarred: false,
	setGenreFilter: (genreFilter) => set({ genreFilter }),
	setSearchTerm: (searchTerm) => set({ searchTerm }),
	setSortOption: (sortOption) => set({ sortOption }),
	isGameSheetOpen: false, // Initial value
	setIsGameSheetOpen: (isOpen) => set({ isGameSheetOpen: isOpen }),
	selectedGameId: null,
	setSelectedGameId: (gameId) => set({ selectedGameId: gameId }),
	selectGame: (gameId) => set({ selectedGameId: gameId, isGameSheetOpen: true }),
	handleToggleFilterOnPlayed: () =>
		set((state) => ({
			filterOnPlayed: !state.filterOnPlayed,
		})),
	handleToggleFilterOnUnPlayed: () =>
		set((state) => ({
			filterOnUnPlayed: !state.filterOnUnPlayed,
		})),
	handleToggleFilterOnCompleted: () =>
		set((state) => ({ filterOnCompleted: !state.filterOnCompleted })),
	handleToggleFilterOnUnCompleted: () =>
		set((state) => ({ filterOnUnCompleted: !state.filterOnUnCompleted })),
	handleToggleFilterOnRated: () =>
		set((state) => ({ filterOnRated: !state.filterOnRated })),
	handleToggleFilterOnUnrated: () =>
		set((state) => ({ filterOnUnrated: !state.filterOnUnrated })),
	handleToggleFilterOnStarred: () =>
		set((state) => ({ filterOnStarred: !state.filterOnStarred })),
	setFilterOnStarred: (filter) => set({ filterOnStarred: filter }),
	setFilterOnRated: (filter) => set({ filterOnRated: filter }),
	setFilterOnUnRated: (filter) => set({ filterOnUnrated: filter }),
	setFilterOnPlayed: (filter) => set({ filterOnPlayed: filter }),
	setFilterOnUnPlayed: (filter) => set({ filterOnUnPlayed: filter }),
	setFilterOnCompleted: (filter) => set({ filterOnCompleted: filter }),
	setFilterOnUnCompleted: (filter) => set({ filterOnUnCompleted: filter }),
	handleGenreToggled: (genre) =>
		set((state) => ({
			genreFilter: state.genreFilter.includes(genre)
				? [...state.genreFilter].filter((g) => g !== genre)
				: [...state.genreFilter, genre],
		})),
	handleToggleAllGenres: (genres) =>
		set((state) => {
			if (genres.length > state.genreFilter.length) {
				return { genreFilter: genres };
			}
			return { genreFilter: [] };
		}),
	handleToggleSortName: () =>
		set((state) =>
			state.sortOption === "nameAsc"
				? { sortOption: "nameDesc" }
				: { sortOption: "nameAsc" },
		),
	handleTogglePlayerRating: () =>
		set((state) =>
			state.sortOption === "playerRatingAsc"
				? { sortOption: "playerRatingDesc" }
				: { sortOption: "playerRatingAsc" },
		),
	handleToggleSortDateAdded: () =>
		set((state) =>
			state.sortOption === "dateAddedAsc"
				? { sortOption: "dateAddedDesc" }
				: { sortOption: "dateAddedAsc" },
		),
	handleToggleSortReleaseDate: () =>
		set((state) =>
			state.sortOption === "releaseDateAsc"
				? { sortOption: "releaseDateDesc" }
				: { sortOption: "releaseDateAsc" },
		),
	handleToggleSortRating: () =>
		set((state) =>
			state.sortOption === "ratingDesc"
				? { sortOption: "ratingAsc" }
				: { sortOption: "ratingDesc" },
		),
	handleToggleSortAggRating: () =>
		set((state) =>
			state.sortOption === "aggregatedRatingAsc"
				? { sortOption: "aggregatedRatingDesc" }
				: { sortOption: "aggregatedRatingAsc" },
		),
	handleToggleSortAggRatingCount: () =>
		set((state) =>
			state.sortOption === "aggregatedRatingCountAsc"
				? { sortOption: "aggregatedRatingCountDesc" }
				: { sortOption: "aggregatedRatingCountAsc" },
		),
	handleToggleSortFollows: () =>
		set((state) =>
			state.sortOption === "followersAsc"
				? { sortOption: "followersDesc" }
				: { sortOption: "followersAsc" },
		),
	setIsTableView: (isTableView) => set({ isTableView }),
	handleToggleView: () => set((state) => ({ isTableView: !state.isTableView })),
}));

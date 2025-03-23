const BASE_RATING = 7;
const BASE_RATING_COUNT = 150;
export function calculateWeightedRating(rating: number, ratingCount: number): number {
	return (
		(rating * ratingCount + BASE_RATING * BASE_RATING_COUNT) /
		(ratingCount + BASE_RATING_COUNT)
	);
}

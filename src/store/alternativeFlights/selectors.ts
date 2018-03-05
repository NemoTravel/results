import { createSelector } from 'reselect';
import {
	ApplicationState, FareFamiliesCombinationsState, FareFamiliesPricesState,
	SelectedFamiliesState
} from '../../state';
import FareFamily from '../../schemas/FareFamily';

export const getSelectedFamilies = (state: ApplicationState): SelectedFamiliesState => state.alternativeFlights.selectedFamilies;
export const getFareFamiliesCombinations = (state: ApplicationState): FareFamiliesCombinationsState => state.alternativeFlights.fareFamiliesCombinations;

export const getSelectedCombinations = createSelector(
	[getSelectedFamilies],
	(selectedFamilies: SelectedFamiliesState): string[] => {
		const result: string[] = [];

		for (const legId in selectedFamilies) {
			if (selectedFamilies.hasOwnProperty(legId)) {
				const legCombinationParts: string[] = [];
				const familiesBySegments = selectedFamilies[legId];

				for (const segmentId in familiesBySegments) {
					if (familiesBySegments.hasOwnProperty(segmentId)) {
						legCombinationParts.push(familiesBySegments[segmentId]);
					}
				}

				result.push(legCombinationParts.join('_'));
			}
		}

		return result;
	}
);

export const combinationsAreValid = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: string[], combinations: FareFamiliesCombinationsState): boolean => {
		let result = false;

		if (Object.keys(combinations).length === selectedCombinations.length) {
			result = !selectedCombinations.find((combination, index): boolean => {
				const legCombinations = combinations[index];

				return !legCombinations.validCombinations.hasOwnProperty(combination);
			});
		}

		return result;
	}
);

/**
 * Get price differences for fare families.
 */
export const getFareFamiliesPrices =  createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: string[], combinationsByLegs: FareFamiliesCombinationsState): FareFamiliesPricesState => {
		const result: FareFamiliesPricesState = {};

		selectedCombinations.forEach((selectedLegCombination, legId): void => {
			const
				dumbPrice = { amount: 0, currency: 'RUB' },

				// Fare families combinations information on leg.
				combinations = combinationsByLegs[legId],

				// List of selected fare families grouped by segment id.
				selectedFamiliesBySegments = selectedLegCombination.split('_'),

				// List of fare families displayed on each segment.
				familiesBySegments = combinations.fareFamiliesBySegments,

				// Price of the current selected combination.
				currentPrice = combinations.combinationsPrices[selectedLegCombination] ? combinations.combinationsPrices[selectedLegCombination] : dumbPrice;

			if (!result.hasOwnProperty(legId)) {
				result[legId] = {};
			}

			for (const segmentKey in familiesBySegments) {
				if (familiesBySegments.hasOwnProperty(segmentKey)) {
					const segmentId = parseInt(segmentKey.replace('S', ''));

					if (!result[legId].hasOwnProperty(segmentId)) {
						result[legId][segmentId] = {};
					}

					// Loop through all families on segment and try to get the price of each family.
					familiesBySegments[segmentKey].forEach((family: FareFamily, index: number): void => {
						const familyKey = `F${index + 1}`;
						const newCombinationParts = [ ...selectedFamiliesBySegments ];

						// Replace family key on the segment with the new test one.
						newCombinationParts[segmentId] = familyKey;

						// Create new test combination.
						const newCombination = newCombinationParts.join('_');

						// Check if this test combination is valid and has it's own price.
						if (combinations.combinationsPrices.hasOwnProperty(newCombination)) {
							// Calculate difference between new test price and the current one.
							result[legId][segmentId][familyKey] = {
								amount: combinations.combinationsPrices[newCombination].amount - currentPrice.amount,
								currency: currentPrice.currency
							};
						}
					});
				}
			}
		});

		return result;
	}
);

import { createSelector } from 'reselect';
import Flight from '../models/Flight';
import { getFlightsIdsByLegs, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import * as TimeFilter from './filters/time/selectors';
import { getAllFlights, getFlightsForCurrentLeg } from './flights/selectors';
import * as Sorting from './sorting/selectors';
import { sortingFunctionsMap } from './sorting/selectors';
import { FlightsRTState } from './flightsRT/reducers';
import Money from '../schemas/Money';
import { getCurrentLegId, isLastLeg } from './currentLeg/selectors';
import * as FareFamilies from './fareFamilies/selectors';
import {
	getSelectedFlights,
	getSelectedFlightsIds,
	getTotalPriceOfSelectedFlights,
	isSelectionComplete
} from './selectedFlights/selectors';
import { getFlightsRT } from './flightsRT/selectors';
import { MAX_VISIBLE_FLIGHTS, UID_LEG_GLUE } from '../utils';
import { Currency } from '../enums';
import { FlightsReplacement } from '../schemas/SelectedFlight';
import { FlightsByLegsState } from './flightsByLegs/reducers';
import { SelectedFlightsState } from './selectedFlights/reducers';
import { FlightsState } from './flights/reducers';
import { SortingState } from './sorting/reducers';
import { FareFamiliesCombinationsState } from './fareFamilies/fareFamiliesCombinations/reducers';
import { getShowAllFlights } from './showAllFlights/selectors';
import { getFlightNumber } from './filters/flightNumber/selectors';

export interface PricesByFlights {
	[flightId: number]: Money;
}

interface PricesByLegs {
	[legId: number]: Money;
}

/**
 * Get a list of min prices for each leg.
 */
export const getMinPricesByLegs = createSelector(
	[getAllFlights, getFlightsIdsByLegs],
	(flightsPool: FlightsState, flightsByLegs: FlightsByLegsState): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in flightsByLegs) {
			if (flightsByLegs.hasOwnProperty(legId)) {
				const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];

				result[legId] = flightsIds.map(flightId => flightsPool[flightId]).reduce(
					(minPrice: Money, flight: Flight): Money => {
						return (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
					},
				null);
			}
		}

		return result;
	}
);

/**
 * Get a list of min total possible prices for each leg.
 *
 * Example:
 * - leg 1 min price is $120
 * - leg 2 min price is $80
 * - leg 3 min price is $100
 *
 * Then:
 * - leg 1 min total possible price is $80 + $100 = 180$
 * - leg 2 min total possible price is $100
 * - leg 3 min total possible price is $0
 */
export const getMinTotalPossiblePricesByLegs = createSelector(
	[getMinPricesByLegs],
	(minPricesByLegs: PricesByLegs): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in minPricesByLegs) {
			if (minPricesByLegs.hasOwnProperty(legId)) {
				if (!result.hasOwnProperty(legId)) {
					result[legId] = { amount: 0, currency: Currency.RUB };
				}

				// For each leg: loop through all next legs and sum up their min prices.
				for (const anotherLegId in minPricesByLegs) {
					if ((parseInt(anotherLegId)) > parseInt(legId) && minPricesByLegs.hasOwnProperty(anotherLegId)) {
						result[legId].amount += minPricesByLegs[anotherLegId].amount;
					}
				}
			}
		}

		return result;
	}
);

/**
 * Check if there are any transfer flights.
 */
export const hasAnyTransferFlights = createSelector(
	[getFlightsForCurrentLeg],
	(flights: Flight[]): boolean => {
		const numOfTransferFlights = flights.filter(flight => flight.segments.length > 1).length;

		return numOfTransferFlights > 1 && numOfTransferFlights !== flights.length;
	}
);

/**
 * Calculating total price.
 */
export const getTotalPrice = createSelector(
	[
		getAllFlights,
		getSelectedFlightsIds,
		isSelectionComplete,
		FareFamilies.getSelectedCombinations,
		FareFamilies.getFareFamiliesCombinations,
		getMinPricesByLegs,
		getMinTotalPossiblePricesByLegs
	],
	(
		allFlights: FlightsState,
		selectedFlightsIds: SelectedFlightsState,
		selectionComplete: boolean,
		selectedCombinations: FareFamilies.SelectedCombinations,
		combinations: FareFamiliesCombinationsState,
		minPricesByLegs: PricesByLegs,
		minTotalPossiblePricesByLegs: PricesByLegs
	): Money => {
		let RTFound = false;
		const totalPrice: Money = {
			amount: 0,
			currency: Currency.RUB
		};

		// Loop through selected flights ids.
		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const intLegId = parseInt(legId);
				const flightId = selectedFlightsIds[legId].newFlightId;

				// If main flights have been successfully selected,
				// then it's time to choose alternative flights (fare families).
				if (selectionComplete && selectedCombinations[legId] && combinations[legId]) {
					const combination = selectedCombinations[legId];

					// Check if selected fare families combination is valid and has its own price.
					if (combinations[legId].combinationsPrices.hasOwnProperty(combination)) {
						totalPrice.amount += combinations[legId].combinationsPrices[combination].amount;
					}
				}
				else {
					// Get flight and add its price to the total sum.
					if (allFlights.hasOwnProperty(flightId)) {
						const flight = allFlights[flightId];

						if (!RTFound) {
							totalPrice.amount += flight.totalPrice.amount;
						}

						if (flight.isRT) {
							RTFound = true;
						}
					}
				}

				if (!RTFound && !selectionComplete && minTotalPossiblePricesByLegs[intLegId]) {
					totalPrice.amount += minTotalPossiblePricesByLegs[intLegId].amount;
				}
			}
		}

		return totalPrice;
	}
);

export const getPricesForCurrentLeg = createSelector(
	[
		getFlightsForCurrentLeg,
		getFlightsRT,
		isLastLeg,
		getSelectedFlights,
		getTotalPriceOfSelectedFlights
	],
	(
		flights: Flight[],
		flightsRT: FlightsRTState,
		isLastLeg: boolean,
		selectedFlights: Flight[],
		totalPriceOfSelectedFlights: number
	): FlightsReplacement => {
		const result: FlightsReplacement = {};
		const selectedUID = selectedFlights.map(flight => flight.uid).join(UID_LEG_GLUE);

		flights.forEach(flight => {
			let newFlightId = flight.id;
			let price = flight.totalPrice;
			let isRT = false;
			const candidateUID = selectedUID ? `${selectedUID}|${flight.uid}` : flight.uid;
			const possibleTotalPrice = totalPriceOfSelectedFlights + price.amount;
			const originalFlightId = flight.id;

			if (isLastLeg) {
				// Sometimes RT flight could be cheaper than OW+OW flight.
				// Loop through all RT flights and try to find one that is cheaper than currently selected combination.
				for (const uid in flightsRT) {
					if (flightsRT.hasOwnProperty(uid)) {
						const RTFlight: Flight = flightsRT[uid];

						// RT UID example: 'AY-720_1pc_AY-1071_1pc|AY-1076_1pc_AY-719_1pc'
						if (uid.startsWith(candidateUID) && RTFlight.totalPrice.amount < possibleTotalPrice) {
							price = RTFlight.totalPrice;
							newFlightId = RTFlight.id;
							isRT = true;
							break;
						}
					}
				}
			}

			result[flight.id] = {
				price,
				isRT,
				originalFlightId,
				newFlightId
			};
		});

		return result;
	}
);

export const getRelativePrices = createSelector(
	[
		getAllFlights,
		getPricesForCurrentLeg,
		getMinPricesByLegs,
		getTotalPrice,
		getMinTotalPossiblePricesByLegs,
		getCurrentLegId
	],
	(
		allFlights: FlightsState,
		prices: FlightsReplacement,
		minPrices: PricesByLegs,
		totalPrice: Money,
		minTotalPossiblePricesByLegs: PricesByLegs,
		legId: number
	): FlightsReplacement => {
		const minPriceOnCurrentLeg = minPrices[legId] ? minPrices[legId].amount : 0;
		const minTotalPriceForNextLegs = minTotalPossiblePricesByLegs[legId] ? minTotalPossiblePricesByLegs[legId].amount : 0;
		const result: FlightsReplacement = {};

		for (const flightId in prices) {
			if (prices.hasOwnProperty(flightId) && allFlights.hasOwnProperty(flightId)) {
				const priceCandidate = prices[flightId];
				let amount: number;

				if (priceCandidate.isRT) {
					// Hurray! We have found cheap RT flight.
					amount = priceCandidate.price.amount - totalPrice.amount;
				}
				else {
					// We haven't found any cheap RT flights :(
					amount = priceCandidate.price.amount + (legId === 0 ? minTotalPriceForNextLegs : -(minPriceOnCurrentLeg));
				}

				result[flightId] = {
					...priceCandidate,
					price: {
						amount,
						currency: priceCandidate.price.currency
					}
				};
			}
		}

		return result;
	}
);

/**
 * Get an array of flights after filtering.
 */
export const getVisibleFlights = createSelector(
	[
		getFlightsForCurrentLeg,
		getSelectedAirlinesList,
		getSelectedDepartureAirportsList,
		getSelectedArrivalAirportsList,
		TimeFilter.getSelectedDepartureTimeIntervals,
		TimeFilter.getSelectedArrivalTimeIntervals,
		getIsDirectOnly,
		getFlightNumber,
		getShowAllFlights,
		Sorting.getCurrentSorting,
		getRelativePrices
	],
	(
		flights: Flight[],
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean,
		flightNumber: string,
		showAllFlights: boolean,
		sorting: SortingState,
		prices: FlightsReplacement
	): Flight[] => {
		let newFlights = flights.filter(flight => {
			const firstSegment = flight.segments[0];
			const lastSegment = flight.segments[flight.segments.length - 1];

			// Filter direct flights.
			if (directOnly && flight.segments.length !== 1) {
				return false;
			}

			if (flightNumber && flight.uid.toLowerCase().indexOf(flightNumber.toLowerCase()) === -1) {
				return false;
			}

			// Filter by departure airport.
			if (Object.keys(selectedDepartureAirports).length && !(firstSegment.depAirport.IATA in selectedDepartureAirports)) {
				return false;
			}

			// Filter by arrival airport.
			if (Object.keys(selectedArrivalAirports).length && !(lastSegment.arrAirport.IATA in selectedArrivalAirports)) {
				return false;
			}

			// Filter by airline.
			if (Object.keys(selectedAirlines).length && !flight.segments.find(segment => segment.airline.IATA in selectedAirlines)) {
				return false;
			}

			// Filter by departure time.
			if (Object.keys(selectedDepartureTimeIntervals).length && !(TimeFilter.getTimeIntervalForDate(firstSegment.depDate) in selectedDepartureTimeIntervals)) {
				return false;
			}

			// Filter by arrival time.
			return !(Object.keys(selectedArrivalTimeIntervals).length && !(TimeFilter.getTimeIntervalForDate(lastSegment.arrDate) in selectedArrivalTimeIntervals));
		});

		newFlights = newFlights.sort((a, b) => sortingFunctionsMap[sorting.type](a, b, sorting.direction, prices));

		if (!showAllFlights) {
			newFlights = newFlights.slice(0, MAX_VISIBLE_FLIGHTS);
		}

		return newFlights;
	}
);

/**
 * Check if there are any visible flights for current leg.
 */
export const hasAnyVisibleFlights = createSelector(
	[getVisibleFlights],
	(flights: Flight[]): boolean => !!flights.length
);

export const hasHiddenFlights = createSelector(
	[getShowAllFlights, getFlightsForCurrentLeg, getVisibleFlights],
	(showAllFlights: boolean, allFlights: Flight[], visibleFlights: Flight[]): boolean => {
		return !showAllFlights && allFlights.length > MAX_VISIBLE_FLIGHTS && !(visibleFlights.length < MAX_VISIBLE_FLIGHTS);
	}
);

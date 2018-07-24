import { getFlightsIdsByLegs } from '../flightsByLegs/selectors';
import { createSelector } from 'reselect';
import Flight from '../../models/Flight';
import { FlightsState } from './reducers';
import { getCurrentLegId } from '../currentLeg/selectors';
import { RootState } from '../reducers';
import { FlightsByLegsState } from '../flightsByLegs/reducers';
import { getCurrency } from '../currency/selectors';
import { Currency } from '../../enums';
import Money from '../../schemas/Money';
import { PricesByLegs } from '../../schemas/PricesByLegs';

/**
 * Get list of flights grouped by flight id.
 *
 * @param {RootState} state
 * @returns {FlightsState}
 */
export const getAllFlights = (state: RootState): FlightsState => state.flights;

/**
 * Get an array of all flights on the current selected leg.
 *
 * @param {RootState} state
 * @returns {Flight[]}
 */
export const getFlightsForCurrentLeg = createSelector(
	[getAllFlights, getFlightsIdsByLegs, getCurrentLegId],
	(allFlights: FlightsState, flightsByLegs: FlightsByLegsState, legId: number): Flight[] => {
		const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];
		const result: Flight[] = [];

		flightsIds.forEach(flightId => {
			if (allFlights.hasOwnProperty(flightId)) {
				result.push(allFlights[flightId]);
			}
		});

		return result;
	}
);

/**
 * Get a list of min prices for each leg.
 */
export const getMinPricesByLegs = createSelector(
	[getAllFlights, getFlightsIdsByLegs, getCurrency],
	(flightsPool: FlightsState, flightsByLegs: FlightsByLegsState, currency: Currency): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in flightsByLegs) {
			if (flightsByLegs.hasOwnProperty(legId)) {
				const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];
				const flights: Flight[] = [];

				flightsIds.forEach(flightId => {
					if (flightsPool.hasOwnProperty(flightId)) {
						flights.push(flightsPool[flightId]);
					}
				});

				if (flights.length) {
					let minPrice: Money = null;

					flights.forEach(flight => {
						minPrice = (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
					});

					result[legId] = minPrice;
				}
				else {
					result[legId] = {
						amount: 0,
						currency: currency
					};
				}
			}
		}

		return result;
	}
);

import { Action } from 'redux';
import { LocationType, FlightTimeType } from '../../../state';

export const FILTERS_ADD_TIME = 'FILTERS_ADD_TIME';
export const FILTERS_REMOVE_TIME = 'FILTERS_REMOVE_TIME';
export const FILTERS_REMOVE_ALL_TIME = 'FILTERS_REMOVE_ALL_TIME';

export interface FilterTimeAction extends Action {
	payload: FlightTimeType;
	locationType: LocationType;
}

/**
 * Add time interval to the list of time intervals used for filtering.
 *
 * @param {FlightTimeType} time
 * @param {LocationType} type
 * @returns {FilterAirportsAction}
 */
export const addTimeInterval = (time: FlightTimeType, type: LocationType): FilterTimeAction => {
	return {
		type: FILTERS_ADD_TIME,
		locationType: type,
		payload: time
	};
};

/**
 * Remove time interval from the list of time intervals used for filtering.
 *
 * @param {FlightTimeType} time
 * @param {LocationType} type
 * @returns {FilterAirportsAction}
 */
export const removeTimeInterval = (time: FlightTimeType, type: LocationType): FilterTimeAction => {
	return {
		type: FILTERS_REMOVE_TIME,
		locationType: type,
		payload: time
	};
};

/**
 * Clear the list of time intervals used for filtering.
 *
 * @returns {Action}
 */
export const removeAllTimeIntervals = (): Action => {
	return {
		type: FILTERS_REMOVE_ALL_TIME
	};
};

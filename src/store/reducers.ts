import { combineReducers } from 'redux';

import { flightsByLegsReducer as flightsByLegs, FlightsByLegsState } from './flightsByLegs/reducers';
import { loadingReducer as isLoading } from './isLoading/reducers';
import {
	FareFamiliesLoadingState,
	loadingFareFamiliesReducer as isLoadingFareFamilies
} from './isLoadingFareFamilies/reducers';
import { Config, configReducer as config } from './config/reducers';
import { filtersReducer as filters, FiltersState } from './filters/reducers';
import { currentLegReducer as currentLeg } from './currentLeg/reducers';
import { selectedFlightsReducer as selectedFlights, SelectedFlightsState } from './selectedFlights/reducers';
import { flightsReducer as flights, FlightsState } from './flights/reducers';
import { fareFamiliesReducer as fareFamilies } from './fareFamilies/reducers';
import { sortingReducer as sorting, SortingState } from './sorting/reducers';
import { flightsRTReducer as flightsRT, FlightsRTState } from './flightsRT/reducers';
import { legsReducer as legs } from './legs/reducers';
import { showAllFlightsReducer as showAllFlights } from './showAllFlights/reducers';
import Leg from '../schemas/Leg';
import { FareFamiliesState } from './fareFamilies/reducers';
import { batchActionsReducer } from './batching/reducers';

export interface RootState {
	config: Config;
	currentLeg: number;
	filters: FiltersState;
	flights: FlightsState;
	flightsRT: FlightsRTState;
	flightsByLegs: FlightsByLegsState;
	isLoading: boolean;
	isLoadingFareFamilies: FareFamiliesLoadingState;
	selectedFlights: SelectedFlightsState;
	fareFamilies: FareFamiliesState;
	legs: Leg[];
	sorting: SortingState;
	showAllFlights: boolean;
}

export const rootReducer = batchActionsReducer(combineReducers<RootState>({
	isLoading,
	isLoadingFareFamilies,
	flights,
	flightsRT,
	flightsByLegs,
	filters,
	config,
	currentLeg,
	selectedFlights,
	fareFamilies,
	sorting,
	legs,
	showAllFlights
}));

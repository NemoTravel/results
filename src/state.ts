import { ThunkAction } from 'redux-thunk';
import Flight from './models/Flight';
import Leg from './schemas/Leg';
import FareFamiliesCombinations from './schemas/FareFamiliesCombinations';
import Money from './schemas/Money';
import { FlightTimeInterval, Language, LocationType, SortingDirection, SortingType } from './enums';

export type CommonThunkAction = ThunkAction<void, ApplicationState, null>;

export interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

export interface AirportsFilterState {
	[LocationType.Arrival]: string[];
	[LocationType.Departure]: string[];
}

export interface TimeFilterState {
	[LocationType.Arrival]: FlightTimeInterval[];
	[LocationType.Departure]: FlightTimeInterval[];
}

export interface FiltersState {
	airlines: string[];
	directOnly: boolean;
	airports: AirportsFilterState;
	time: TimeFilterState;
}

export interface FlightsByLegsState {
	[legId: number]: number[];
}

export interface SelectedFlightsState {
	[legId: number]: number;
}

export interface FlightsState {
	[flightId: number]: Flight;
}

export interface FlightsRTState {
	[flightUID: string]: Flight;
}

export interface SelectedFamiliesSegmentCombination {
	[segmentId: number]: string;
}

export interface SelectedFamiliesState {
	[legId: number]: SelectedFamiliesSegmentCombination;
}

export interface FareFamiliesCombinationsState {
	[legId: number]: FareFamiliesCombinations;
}

export interface FareFamiliesPricesState {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: Money;
		};
	};
}

export interface FareFamiliesAvailabilityState {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: boolean;
		};
	};
}

export interface AlternativeFlightsState {
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

export interface SortingState {
	type: SortingType;
	direction: SortingDirection;
}

export interface ApplicationState {
	config: Config;
	currentLeg: number;
	filters: FiltersState;
	flights: FlightsState;
	flightsRT: FlightsRTState;
	flightsByLegs: FlightsByLegsState;
	isLoading: boolean;
	selectedFlights: SelectedFlightsState;
	alternativeFlights: AlternativeFlightsState;
	legs: Leg[];
	sorting: SortingState;
	showAllFlights: boolean;
}

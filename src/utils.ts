import { Language } from './enums';
import * as moment from 'moment';
import Date from './schemas/Date';
import RequestInfo from './schemas/RequestInfo';
import Leg from './schemas/Leg';
import { createStructuredSelector, Selector } from 'reselect';
import { RootState } from './store/reducers';

export const REQUEST_URL = 'http://frontend.mlsd.ru/';
export const UID_LEG_GLUE = '|';
export const UID_SEGMENT_GLUE = '_';
export const ISO_DATE_LENGTH = 19;
export const MAX_VISIBLE_FLIGHTS = 15;
export const NUM_OF_RT_SEGMENTS = 2;

const lastSingleNumber = 9;

/**
 * Convert '9' number to '09'.
 *
 * @param {number} brokenNumber
 * @returns {string}
 */
const fixNumber = (brokenNumber: number): string => brokenNumber > lastSingleNumber ? brokenNumber.toString() : '0' + brokenNumber.toString();

/**
 * Convert Nemo date object to Moment.
 *
 * @param {Date} date
 * @returns {moment.Moment}
 */
export const convertNemoDateToMoment = (date: Date): moment.Moment => {
	let dateString = `${date.year}-${fixNumber(date.month)}-${fixNumber(date.day)}T${fixNumber(date.hours)}:${fixNumber(date.minutes)}:${fixNumber(date.seconds)}`;

	if (date.offsetUTC) {
		dateString += date.offsetUTC;
	}

	return moment(dateString);
};

export const fixImageURL = (url: string): string => {
	let result: string;

	// If base URL ends with '/' - leave it as is.
	result = REQUEST_URL[REQUEST_URL.length - 1] === '/' ? REQUEST_URL : REQUEST_URL + '/';

	// If images URL starts with '/' - remove it (prevent double-slash bug).
	result += url && url[0] === '/' ? url.substr(1) : url;

	return result;
};

export const addCodeInList = (list: string[], code: string): string[] => {
	const result: string[] = [...list];

	if (!list.find(existingCode => existingCode === code)) {
		result.push(code);
	}

	return result;
};

export const removeCodeFromList = (list: string[], code: string): string[] => {
	return list.filter(existingCode => existingCode !== code);
};

export const declension = (word: string, language = Language.Russian): string => {
	if (language === Language.Russian) {
		const lastLetterIndex = word.length - 1;
		const lastLetter = word[lastLetterIndex];
		let newWord = word;
		let newSuffix: string;

		if (word === 'Казань' || word === 'Пермь') {
			newSuffix = 'и';
		}
		else if (/[аеёийоуыьэюя]/i.test(lastLetter)) {
			if (/[айь]/i.test(lastLetter)) {
				newSuffix = 'е';
			}
			else if (lastLetter === 'ы') {
				newSuffix = 'ах';
			}
		}
		else {
			newWord = word + 'е';
		}

		if (newSuffix) {
			newWord = word.substr(0, lastLetterIndex) + newSuffix;
		}

		return newWord;
	}

	return word;
};

export const pluralize = (number: number, ...variations: string[]): string => {
	let result = '';
	const lastLetterIndex = number.toString().length - 1;
	const lastLetter = number.toString()[lastLetterIndex];

	switch (lastLetter) {
		case '0':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			result = variations[2];
			break;

		case '1':
			result = number === 11 ? variations[2] : variations[0];
			break;

		case '2':
		case '3':
		case '4':
			result = number > 11 && number < 14 ? variations[2] : variations[1];
			break;
	}

	return result;
};

export const createLegs = (requests: RequestInfo[]): Leg[] => {
	return requests.map((requestInfo, index) => {
		return {
			id: index,
			departure: requestInfo.segments[0].departure,
			arrival: requestInfo.segments[0].arrival,
			date: requestInfo.segments[0].departureDate
		};
	});
};

export function mapStateToProps<P>(selectors: {[K in keyof P]: Selector<RootState, P[K]>}): Selector<RootState, P> {
	return createStructuredSelector<RootState, P>(selectors);
}

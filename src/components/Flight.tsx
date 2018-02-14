import * as React from 'react';
import * as moment from 'moment';

import FlightModel from '../schemas/Flight';
import Segment from '../schemas/Segment';

interface Props {
	flight: FlightModel;
}

class Flight extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props, nextState: any): boolean {
		return this.props.flight.id !== nextProps.flight.id;
	}

	render(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = flight.segments[flight.segments.length - 1];
		const totalFlightTime = flight.segments.reduce((result: number, segment: Segment) => result + segment.flightTime + segment.waitingTime, 0);
		const isDirect = flight.segments.length === 1;
		const isOW = flight.segmentGroups.length === 1;

		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');

		return <div className="flight-summary">
				<div className="flight-summary__left">
					<div className="flight-summary-logo">
						{/*<Tooltip title={firstSegment.airline.name} placement="top">*/}
							<img className="flight-summary-logo__image" src={`http://nemo1${firstSegment.airline.logoIcon}`}/>
						{/*</Tooltip>*/}
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							{firstSegment.depDate.format('HH:MM')}
						</div>

						<div className="flight-summary-stage__location">
							{firstSegment.depAirport.IATA}
						</div>
					</div>

					<div className="flight-summary-stage-routeInfo">
						<div className="flight-summary-stage-routeInfo__arrow"/>
						<span className="flight-summary-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							{lastSegment.arrDate.format('HH:MM')}
						</div>

						<div className="flight-summary-stage__location">
							{lastSegment.arrAirport.IATA}
						</div>
					</div>
				</div>

				<div className="flight-summary__middle">
					<div className="flight-summary-transfers">
						{isDirect ? 'прямой' : null}
						{!isDirect ? flight.segments.slice(0, flight.segments.length - 1).map((segment, index) => {
							const waitingTime = moment.duration(segment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');

							return <div className="flight-summary-transfers__item" key={index}>{waitingTime} пересадка в городе {segment.arrAirport.city.name}</div>;
						}) : null}
					</div>

					<div className="flight-summary-route">
						{firstSegment.depAirport.name} &mdash; {lastSegment.arrAirport.name}
					</div>
				</div>

				<div className="flight-summary__right">
					<div className="flight-summary-price">
						<div className="flight-summary-price__amount">
							{!isOW ? 'от' : null}
							<span className="flight-summary-price__amount-wrapper">
								{flight.totalPrice.amount}
								<span className="flight-summary-price__amount-wrapper__currency">{flight.totalPrice.currency}</span>
							</span>
						</div>

						{!isOW ? <div className="flight-summary-price__scope">
							туда и обратно
						</div> : null}
					</div>

					<div className="flight-summary-buy">
						<button>Выбрать</button>
					</div>
				</div>
			</div>;
	}
}

export default Flight;

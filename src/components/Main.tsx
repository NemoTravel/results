import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import FlightModel from '../schemas/Flight';
import { getVisibleFlights, isMultipleLegs } from '../store/selectors';
import { ApplicationState, CommonThunkAction } from '../state';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, WindowScroller } from 'react-virtualized';
import Toolbar from './Toolbar';
import { selectFlight } from '../store/selectedFlights/actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';

interface StateProps {
	isMultipleLegs: boolean;
	isLoading: boolean;
	flights: FlightModel[];
	currentLeg: number;
}

interface DispatchProps {
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

const rowHeight = 72;

const cache = new CellMeasurerCache({
	defaultHeight: rowHeight,
	fixedWidth: true
});

class Main extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.flightRenderer = this.flightRenderer.bind(this);
	}

	flightRenderer({ index, isScrolling, key, style, parent }: ListRowProps): React.ReactNode {
		return <CellMeasurer
			cache={cache}
			columnIndex={0}
			key={key}
			parent={parent as any}
			rowIndex={index}
		>
			{({ measure }) => (
				<div className="flight__holder" style={style}>
					<Flight onLoad={measure} key={key} flight={this.props.flights[index]} selectFlight={this.props.selectFlight} currentLeg={this.props.currentLeg}/>
				</div>
			)}
		</CellMeasurer>;
	}

	render(): React.ReactNode {
		const numOfFlights = this.props.flights.length;

		return <div className={classNames('results', { results_isLoading: this.props.isLoading })}>
			<LinearProgress className="results-loader" color="secondary" variant="query"/>

			<section className="scenarios"/>

			<section className="filters">
				<DirectOnlyFilter/>
				<AirlineFilter/>
				<AirportsFilter/>
				<TimeFilter/>
			</section>

			<WindowScroller>
				{({ height, isScrolling, onChildScroll, scrollTop }) => (
					<div>
						<AutoSizer disableHeight>
							{({ width }) => (
								<List
									autoHeight
									deferredMeasurementCache={cache}
									height={height}
									width={width}
									isScrolling={isScrolling}
									scrollTop={scrollTop}
									onScroll={onChildScroll}
									rowCount={numOfFlights}
									rowHeight={cache.rowHeight}
									rowRenderer={this.flightRenderer}
								/>
							)}
						</AutoSizer>
					</div>
				)}
			</WindowScroller>

			{isMultipleLegs ? <Toolbar/> : null}
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isMultipleLegs: isMultipleLegs(state),
		isLoading: state.isLoading,
		flights: getVisibleFlights(state),
		currentLeg: state.currentLeg
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFlight: bindActionCreators(selectFlight, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

import * as React from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import * as State from '../state';
import Flight from '../models/Flight';
import SelectedFlights from './FareFamilies/SelectedFlights';
import Leg from './FareFamilies/Leg';
import { searchFareFamilies } from '../store/actions';
import { SelectFamily, selectFamily } from '../store/fareFamilies/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goBack, goToLeg, LegAction } from '../store/currentLeg/actions';
import { getFareFamiliesAvailability, getFareFamiliesPrices } from '../store/fareFamilies/selectors';
import CircularProgress from 'material-ui/Progress/CircularProgress';

interface StateProps {
	selectedFlights: Flight[];
	selectedFamilies: State.SelectedFamiliesState;
	fareFamiliesPrices: State.FareFamiliesPricesState;
	fareFamiliesAvailability: State.FareFamiliesAvailabilityState;
	fareFamiliesCombinations: State.FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: SelectFamily;
	searchFareFamilies: () => Action;
	goToLeg: (legId: number) => LegAction;
	goBack: () => LegAction;
}

type Props = StateProps & DispatchProps;

class FareFamilies extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.goBack = this.goBack.bind(this);
	}

	componentDidMount(): void {
		this.props.searchFareFamilies();
	}

	goBack(): void {
		this.props.goBack();
	}

	render(): React.ReactNode {
		const {
			selectedFamilies,
			selectedFlights,
			fareFamiliesCombinations,
			fareFamiliesAvailability,
			goToLeg,
			selectFamily,
			fareFamiliesPrices
		} = this.props;

		return <section className="fareFamilies">
			<SelectedFlights flights={selectedFlights} goToLeg={goToLeg}/>

			<div className="fareFamilies-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>

			<div className="fareFamilies__inner">
				<Typography className="fareFamilies-title" variant="headline">Выбор тарифа</Typography>

				<div className="fareFamilies__legs">
					{selectedFlights.map((flight, legId) => (
						<Leg
							key={flight.id}
							id={legId}
							flight={flight}
							prices={fareFamiliesPrices ? fareFamiliesPrices[legId] : {}}
							selectedFamilies={selectedFamilies}
							combinations={fareFamiliesCombinations[legId]}
							availability={fareFamiliesAvailability[legId]}
							selectFamily={selectFamily}
						/>
					))}
				</div>

				<Button variant="raised" onClick={this.goBack}>Назад</Button>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: State.ApplicationState): StateProps => {
	return {
		selectedFlights: getSelectedFlights(state),
		fareFamiliesAvailability: getFareFamiliesAvailability(state),
		fareFamiliesPrices: getFareFamiliesPrices(state),
		fareFamiliesCombinations: state.fareFamilies.fareFamiliesCombinations,
		selectedFamilies: state.fareFamilies.selectedFamilies
	};
};

const mapDispatchToProps = {
	selectFamily,
	searchFareFamilies,
	goToLeg,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(FareFamilies);

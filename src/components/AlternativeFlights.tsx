import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Typography from 'material-ui/Typography';

import Segment from './AlternativeFlights/Segment';
import { searchForAlternativeFlights } from '../store/actions';
import { ApplicationState, CommonThunkAction, SelectedFamiliesState } from '../state';
import { SelectedFamiliesAction, selectFamily } from '../store/alternativeFlights/selectedFamilies/actions';

interface StateProps {
	selectedFamilies: SelectedFamiliesState;
}

interface DispatchProps {
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	searchForAlternativeFlights: () => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

class AlternativeFlights extends React.Component<Props> {
	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	render(): React.ReactNode {
		const { selectedFamilies } = this.props;
		const segments = [0];

		return <section className="fareFamilies">
			<Typography className="fareFamilies-title" variant="display1">Выбор тарифа</Typography>

			<div className="alternativeFlights__legs">
				<div className="fareFamilies-leg">
					<div className="fareFamilies-leg__segments">
						{segments.map(segmentId => <Segment key={segmentId} segmentId={segmentId} selectedFamilyId={selectedFamilies[segmentId]} selectFamily={this.props.selectFamily}/>)}
					</div>
				</div>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedFamilies: state.alternativeFlights.selectedFamilies
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFamily: bindActionCreators(selectFamily, dispatch),
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AlternativeFlights);

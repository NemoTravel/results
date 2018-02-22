import * as React from 'react';
import { connect } from 'react-redux';
import { CommonThunkAction } from '../state';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { searchForAlternativeFlights } from '../store/actions';
import Typography from 'material-ui/Typography';
import Radio from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { RadioGroup } from 'material-ui/Radio';

interface DispatchProps {
	searchForAlternativeFlights: () => CommonThunkAction;
}

class AlternativeFlights extends React.Component<DispatchProps> {
	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	render(): React.ReactNode {
		return <section className="fareFamilies">
			<Typography className="fareFamilies-title" variant="display1">Выбор тарифа</Typography>

			<div className="alternativeFlights__legs">
				<div className="fareFamilies-leg">
					<div className="fareFamilies-leg__segments">
						<div className="fareFamilies-leg-segment">
							<Typography className="fareFamilies-leg-segment__title" variant="headline">
								Саратов &mdash; Москва, 24 июня
							</Typography>

							<div className="fareFamilies-leg-segment__families">
								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other1" control={<Radio name="family" color="primary"/>} label="Легкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other2" control={<Radio name="family" color="primary"/>} label="Стандартный"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other3" control={<Radio name="family" color="primary"/>} label="Гибкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other4" control={<Radio name="family" color="primary"/>} label="Бизнес"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>
							</div>
						</div>

						<div className="fareFamilies-leg-segment">
							<Typography className="fareFamilies-leg-segment__title" variant="headline">Москва &mdash; Париж, 25 июня</Typography>

							<div className="fareFamilies-leg-segment__families">
								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other1" control={<Radio name="family" color="primary"/>} label="Легкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other2" control={<Radio name="family" color="primary"/>} label="Стандартный"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other3" control={<Radio name="family" color="primary"/>} label="Гибкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel value="other4" control={<Radio name="family" color="primary"/>} label="Бизнес"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
										<div className="fareFamilies-leg-segment-family-feature">Какая-то фича</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>;
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch)
	};
};

export default connect(null, mapDispatchToProps)(AlternativeFlights);

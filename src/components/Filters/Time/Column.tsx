import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';
import { FlightTimeInterval } from '../../../state';

interface Props {
	selectedTime: ListOfSelectedCodes;
	title: string;
	onChange: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
}

class Column extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedTime !== nextProps.selectedTime;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-column">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								onChange={this.props.onChange}
								checked={FlightTimeInterval.Morning in this.props.selectedTime}
								value={FlightTimeInterval.Morning}
							/>
						}
						label="Утром (06:00 - 12:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								onChange={this.props.onChange}
								checked={FlightTimeInterval.Afternoon in this.props.selectedTime}
								value={FlightTimeInterval.Afternoon}
							/>
						}
						label="Днём (12:00 - 18:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								onChange={this.props.onChange}
								checked={FlightTimeInterval.Evening in this.props.selectedTime}
								value={FlightTimeInterval.Evening}
							/>
						}
						label="Вечером (18:00 - 00:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								onChange={this.props.onChange}
								checked={FlightTimeInterval.Night in this.props.selectedTime}
								value={FlightTimeInterval.Night}
							/>
						}
						label="Ночью (00:00 - 06:00)"
					/>
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Column;

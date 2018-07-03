import * as React from 'react';
import * as classnames from 'classnames';
import { RouterState } from 'connected-react-router';
import { Component as SearchFormComponent, ComponentProps } from '@nemo.travel/search-widget';
import { connect } from 'react-redux';

import { RootState } from '../store/reducers';
import { getLocale, getNemoURL } from '../store/config/selectors';
import { startSearch } from '../store/actions';
import { loadSearchResults } from '../store/results/actions';

type StateProps = ComponentProps & Partial<RouterState>;

interface DispatchProps {
	startSearch: typeof startSearch;
	loadSearchResults: typeof loadSearchResults;
}

type Props = StateProps & DispatchProps;

class SearchForm extends React.Component<Props> {
	protected searchForm: SearchFormComponent = null;

	componentDidMount(): void {
		if (/\/results\/(\d+\/?)+/.test(this.props.location.pathname)) {
			this.props.loadSearchResults(this.props.location.pathname);
		}
		else if (this.props.location.pathname === '/results') {
			this.props.startSearch(this.searchForm.getSeachInfo());
		}
	}

	render(): React.ReactNode {
		const isResultsPage = this.props.location.pathname !== '/';

		return <div className={classnames('results-searchForm', { 'results-searchForm_pinned': isResultsPage })}>
			<SearchFormComponent ref={component => this.searchForm = component} nemoURL={this.props.nemoURL} locale={this.props.locale} onSearch={this.props.startSearch}/>
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		location: state.router.location,
		locale: getLocale(state),
		nemoURL: getNemoURL(state)
	};
};

const mapDispatchToProps = {
	startSearch,
	loadSearchResults
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

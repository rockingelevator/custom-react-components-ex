import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    updateSearchQuery
} from '../../../actions/searchActions';

import {
    fetchUser
} from '../../../actions/userActions';

import {
    fetchMoreCVs,
    addCVToFavorites,
    removeCVFromFavorites,
    addCVListToFavorites,
    removeCVListFromFavorites,
    toggleCVSelection,
    unselectAllCVs,
    fetchMyCVs,
    fetchMatchingCVs
} from '../../../actions/cvActions';

import {
    fetchMoreVacancies,
    addVacancyToFavorites,
    removeVacancyFromFavorites,
    addVacanciesListToFavorites,
    removeVacanciesListFromFavorites,
    toggleVacancySelection,
    unselectAllVacancies,
    fetchMyVacancies,
    fetchMatchingVacancies
} from '../../../actions/vacancyActions';

import DashboardSidePanel from '../DashboardSidePanel';
import DashboardContent from '../DashboardContent';
import CardsList from '../../lists/CardsList';
import MatchingFilters from '../MatchingFilters';
import CardsListActionsSideBar from '../../lists/CardsListActionsSideBar';

import 'rc-slider/assets/index.css';
import s from './Matching.css';

class Matching extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: {},
            selected_filter: '',
            matching_count: ''
        };
        this._shouldShowFilterPanel = this._shouldShowFilterPanel.bind(this);
        this._fetchMore = this._fetchMore.bind(this);
        this._unselectAllCards = this._unselectAllCards.bind(this);
        this._toggleFavList = this._toggleFavList.bind(this);
        this.SelectedFilter = this.SelectedFilter.bind(this);
    }

    componentWillMount(){
        const {
            user,
            fetchUser,
        } = this.props;

        var listType;
        let searchQuery = {};
        if(!user || (user && !user.id)){
            fetchUser().then(resp => {
                listType = this.props.user.role;
                if(listType == "employer"){
                    this.props.fetchMyVacancies();
                    searchQuery = {type: 'cv'};
                } else {
                    this.props.fetchMyCVs();
                    searchQuery = {type: 'vacancy'};
                }
            });
        } else {
            listType = this.props.user.role;
            if(listType == "employer"){
                this.props.fetchMyVacancies();
                searchQuery = {type: 'cv'};
            } else {
                this.props.fetchMyCVs();
                searchQuery = {type: 'vacancy'};
            }
        }
    }

    _fetchMore(type) {
        const nextUrl = this.props.listHasMore;
        if(!nextUrl) return;
        const next = nextUrl.split('?')[1];
        if(type == 'cv'){
            this.props.fetchMoreCVs(next);
        } else if(type == 'vacancy'){
            this.props.fetchMoreVacancies(next);
        }
    }

    _shouldShowFilterPanel(filters){
        if(!filters) return false;
        if(Object.keys(filters).length > 0){
            return true;
        }
        return false;
    }

    _toggleFav(itemType, item) {
        if(itemType == 'vacancy') {
            if(!item.favorites) {
                this.props.addVacancyToFavorites({vacancy: item.id});
                this.props.fetchMatchingVacancies(this.state.selected_filter);
            } else {
                this.props.removeVacancyFromFavorites(item.favorites);
                this.props.fetchMatchingVacancies(this.state.selected_filter);
            }
        } else if(itemType == 'cv') {
            if(!item.favorites) {
                this.props.addCVToFavorites({cv: item.id});
                this.props.fetchMatchingCVs(this.state.selected_filter);
            } else {
                this.props.removeCVFromFavorites(item.favorites);
                this.props.fetchMatchingCVs(this.state.selected_filter);
            }
        }
    }

    _handleSort(val) {
        const { searchQuery } = this.props;
        const sort = searchQuery.sort instanceof Array && searchQuery.sort.length > 0 ? searchQuery.sort[0] : searchQuery.sort;
        if(sort != val.value)
            this.props.updateSearchQuery({...searchQuery, sort: val.value});
    }

    _handleCardSelect(type, item) {
        if(type == 'vacancy') {
            this.props.toggleVacancySelection(item);
        } else if(type == 'cv') {
            this.props.toggleCVSelection(item);
        }
    }

    _unselectAllCards(type) {
        if(type == 'vacancy') {
            this.props.unselectAllVacancies();
            this.props.fetchMatchingVacancies(this.state.selected_filter);
        } else if(type == 'cv') {
            this.props.unselectAllCVs();
            this.props.fetchMatchingCVs(this.state.selected_filter);
        }
    }

    _toggleFavList(type, isIncludedNotFavorite) {
        const l = type == 'vacancy' ? this.props.selectedVacancies : this.props.selectedCVs;
        if(isIncludedNotFavorite){
            // add list to favorites
            let ids = [];
            l.map(item => {
                ids.push(item.id);
            })
            if(type == 'vacancy'){
                this.props.addVacanciesListToFavorites({vacancy_ids: ids});
                this.props.fetchMatchingVacancies(this.state.selected_filter);
            } else if(type == 'cv'){
                this.props.addCVListToFavorites({cv_ids: ids});
                this.props.fetchMatchingCVs(this.state.selected_filter);
            }
        }
        else {
            // remove list from favorites
            let favIds = [];
            l.map(item => {
                favIds.push(item.favorites);
            })
            if(type == 'vacancy') {
                this.props.removeVacanciesListFromFavorites({favorites_ids: favIds});
                this.props.fetchMatchingVacancies(this.state.selected_filter);
            } else if(type == 'cv') {
                this.props.removeCVListFromFavorites({favorites_ids: favIds});
                this.props.fetchMatchingCVs(this.state.selected_filter);
            }
        }

    }

    SelectedFilter(id, count){
        this.setState({
            selected_filter: id,
            matching_count: count
        })
    }

    render(){
        const { user } = this.props;

        const listType = user.role == 'employer' ? 'cv' : 'vacancy';
        const itemsList = user.role == 'employer' ? this.props.CVs : this.props.vacancies;

        var filters = user.role == 'employer' ? this.props.vacancies : this.props.CVs;
        const showFilterPanel = this._shouldShowFilterPanel(filters);
        return (
            <div className="dashboardContentWrapper">
                <div className="dashboardContentWrapper__row">
                    {/*LEFT SIDEBAR*/}

                    { showFilterPanel &&
                    <DashboardSidePanel>
                        <MatchingFilters user={user} filters={filters} SelectedFilter={this.SelectedFilter}  />
                    </DashboardSidePanel>
                    }
                    {/*CENTRAL CONTENT*/}
                    <DashboardContent
                        title=""
                        breadcrumbs={[]}
                        blankBackground
                    >
                        <div className={s.listHeader}>
                            <p className={s.listHeader__totalCount}>
                                {gettext(`Результати підбору ${listType == 'cv' ? 'резюме' : 'вакансiй'} на основі даних ${listType == 'cv' ? 'вакансiй' : 'резюме'}`)}
                                :&nbsp;<strong>{this.state.matching_count || '0'}</strong>
                            </p>
                        </div>
                        {this.state.selected_filter != '' ?
                            <CardsList
                                type={listType}
                                items={itemsList}
                                handleChangeActive={this._toggleFav.bind(this)}
                                user={user}
                                isMore={ this.props.listHasMore }
                                fetchMore={e => this._fetchMore(listType)}
                                selected={ listType == 'cv' ? this.props.selectedCVs : this.props.selectedVacancies }
                                handleCardSelect={this._handleCardSelect.bind(this)}
                            />
                            : ''}
                    </DashboardContent>

                    {/*/!*RIGHT SIDEPANEL*!/*/}
                    <DashboardSidePanel right>
                        <CardsListActionsSideBar
                            selected={ listType == 'cv' ? this.props.selectedCVs : this.props.selectedVacancies }
                            handleUnselectAll={ e => this._unselectAllCards(listType) }
                            handleToggleFavList={ val => this._toggleFavList(listType, val) }
                        />
                    </DashboardSidePanel>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        searchQuery: state.searchQuery,
        user: state.user,
        CVs: state.CVs,
        vacancies: state.vacancies,
        filters: state.searchFilters,
        listHasMore: state.isListHasMore,
        listTotalCount: state.listTotalCount,
        selectedVacancies: state.selectedVacancies,
        selectedCVs: state.selectedCVs,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUser,
        updateSearchQuery,
        fetchMoreCVs,
        fetchMoreVacancies,
        addVacancyToFavorites,
        removeVacancyFromFavorites,
        addVacanciesListToFavorites,
        removeVacanciesListFromFavorites,
        toggleVacancySelection,
        unselectAllVacancies,
        addCVToFavorites,
        removeCVFromFavorites,
        addCVListToFavorites,
        removeCVListFromFavorites,
        toggleCVSelection,
        unselectAllCVs,
        fetchMatchingCVs,
        fetchMatchingVacancies,
        fetchMyCVs,
        fetchMyVacancies
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Matching);

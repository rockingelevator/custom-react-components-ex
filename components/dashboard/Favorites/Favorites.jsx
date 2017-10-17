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
    fetchFavoritesCVs,
    fetchFilterFavoritesCVs,
} from '../../../actions/cvActions';

import {
    fetchMoreVacancies,
    addVacancyToFavorites,
    removeVacancyFromFavorites,
    addVacanciesListToFavorites,
    removeVacanciesListFromFavorites,
    toggleVacancySelection,
    unselectAllVacancies,
    fetchFavoritesVacancies,
    fetchFilterFavoritesVacancies
} from '../../../actions/vacancyActions';

import DashboardSidePanel from '../DashboardSidePanel';
import DashboardContent from '../DashboardContent';
import CardsList from '../../lists/CardsList';
import FavoritesFilters from '../FavoritesFilters';
import CardsListActionsSideBar from '../../lists/CardsListActionsSideBar';

import 'rc-slider/assets/index.css';
import s from './Favorites.css';

class Favorites extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: {}
        };
        this._shouldShowFilterPanel = this._shouldShowFilterPanel.bind(this);
        this._fetchMore = this._fetchMore.bind(this);
        this._unselectAllCards = this._unselectAllCards.bind(this);
        this._toggleFavList = this._toggleFavList.bind(this);
    }

    componentWillMount(){
        const {
            user,
            fetchUser,
        } = this.props;

        var listType;

        let searchQuery = {};
        if(!user || (user && !user.id)) {
            fetchUser().then(resp => {
                listType = this.props.user.role;
                if(listType == "employer"){
                    this.props.fetchFavoritesCVs();
                    searchQuery = {
                        type: 'cv',
                        page: 'favorites'
                    };
                } else {
                    this.props.fetchFavoritesVacancies();
                    searchQuery = {
                        type: 'vacancy',
                        page: 'favorites'
                    };
                }
            });
        } else {
            listType = this.props.user.role;
            if(listType == "employer"){
                this.props.fetchFavoritesCVs();
                searchQuery = {
                    type: 'cv',
                    page: 'favorites'
                };
            } else {
                this.props.fetchFavoritesVacancies();
                searchQuery = {
                    type: 'vacancy',
                    page: 'favorites'
                };
            }
        }

        this.props.updateSearchQuery({...searchQuery});
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
            for (let f in filters){
                return true;
            }
        }
        return false;
    }

    _toggleFav(itemType, item) {
        var that = this;

        if(itemType == 'vacancy') {
            if(!item.favorites) {
                this.props.addVacancyToFavorites({vacancy: item.id}).then(resp => {
                    that.props.fetchFavoritesVacancies();
                });
            } else {
                this.props.removeVacancyFromFavorites(item.favorites).then(resp => {
                    that.props.fetchFavoritesVacancies();
                });
            }
        } else if(itemType == 'cv') {
            if(!item.favorites) {
                this.props.addCVToFavorites({cv: item.id}).then(resp => {
                    that.props.fetchFavoritesCVs();
                });
            } else {
                this.props.removeCVFromFavorites(item.favorites).then(resp => {
                    that.props.fetchFavoritesCVs();
                });
            }
        }
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
        } else if(type == 'cv') {
            this.props.unselectAllCVs();
        }
    }

    _toggleFavList(type, isIncludedNotFavorite) {
        var that = this;
        const l = type == 'vacancy' ? this.props.selectedVacancies : this.props.selectedCVs;
        if(isIncludedNotFavorite){
            // add list to favorites
            let ids = [];
            l.map(item => {
                ids.push(item.id);
            })
            if(type == 'vacancy'){
                this.props.addVacanciesListToFavorites({vacancy_ids: ids}).then(resp => {
                    that.props.fetchFavoritesVacancies();
                });
            } else if(type == 'cv'){
                this.props.addCVListToFavorites({cv_ids: ids}).then(resp => {
                    that.props.fetchFavoritesCVs();
                });
            }
        }
        else {
            // remove list from favorites
            let favIds = [];
            l.map(item => {
                favIds.push(item.favorites);
            })
            if(type == 'vacancy') {
                this.props.removeVacanciesListFromFavorites({favorites_ids: favIds}).then(resp => {
                    that.props.fetchFavoritesVacancies();
                });
            } else if(type == 'cv') {
                this.props.removeCVListFromFavorites({favorites_ids: favIds}).then(resp => {
                    that.props.fetchFavoritesCVs();
                });
            }
        }

    }

    render(){
        const { searchQuery, user, filters } = this.props;
        const showFilterPanel = this._shouldShowFilterPanel(filters);
        const listType = user.role == 'employer' ? 'cv' : 'vacancy';
        const itemsList = listType == 'cv' ? this.props.CVs : this.props.vacancies;

        return (

            <div className="dashboardContentWrapper">
                <div className="dashboardContentWrapper__row">
                    {/*LEFT SIDEBAR*/}

                    { showFilterPanel &&
                    <DashboardSidePanel>
                        <FavoritesFilters user={user} />
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
                                {gettext(`Відибрані ${listType == 'cv' ? 'резюме' : 'вакансiї'}`)}
                                :&nbsp;<strong>{this.props.listTotalCount || '0'}</strong>
                            </p>
                        </div>
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
                    </DashboardContent>


                    {/*RIGHT SIDEPANEL*/}
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
        favorites: state.favorites
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
        fetchFavoritesCVs,
        fetchFavoritesVacancies,
        fetchFilterFavoritesVacancies,
        fetchFilterFavoritesCVs,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);

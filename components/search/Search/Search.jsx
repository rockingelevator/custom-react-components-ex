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
  fetchCVs,
  fetchMoreCVs,
  addCVToFavorites,
  removeCVFromFavorites,
  addCVListToFavorites,
  removeCVListFromFavorites,
  toggleCVSelection,
  unselectAllCVs,
} from '../../../actions/cvActions';

import {
  fetchVacancies,
  fetchMoreVacancies,
  addVacancyToFavorites,
  removeVacancyFromFavorites,
  addVacanciesListToFavorites,
  removeVacanciesListFromFavorites,
  toggleVacancySelection,
  unselectAllVacancies,
} from '../../../actions/vacancyActions';

import DashboardGrid from '../../dashboard/DashboardGrid';
import DashboardSidePanel from '../../dashboard/DashboardSidePanel';
import DashboardContent from '../../dashboard/DashboardContent';
import CardsList from '../../lists/CardsList';
import Select from '../../forms/Select';
import SearchFilters from '../SearchFilters';
import CardsListActionsSideBar from '../../lists/CardsListActionsSideBar';

import 'rc-slider/assets/index.css';
import s from './Search.css';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: {}
    };
    this._fetchList = this._fetchList.bind(this);
    this._shouldShowFilterPanel = this._shouldShowFilterPanel.bind(this);
    const { match } = this.props;
    this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
    this._fetchMore = this._fetchMore.bind(this);
    this._unselectAllCards = this._unselectAllCards.bind(this);
    this._toggleFavList = this._toggleFavList.bind(this);
  }

  componentWillMount(){
    const {
      user,
      fetchUser,
      location,
      match,
    } = this.props;

    if(!user || (user && !user.id)) fetchUser();
    const urlSearchString = location.search.substring(1);
    let vals = urlSearchString.split('&');
    let searchQuery = {};
    if(vals)
      vals.map(val => {
        let pair = val.split('=');
        if(pair && pair.length > 1){
            if(pair[0] in searchQuery){
              searchQuery[pair[0]].push(pair[1]);
            } else {
              searchQuery[pair[0]] = [pair[1]];
            }
        }
      });

    this.props.updateSearchQuery(searchQuery);
    this._fetchList(searchQuery);
  }

  componentWillReceiveProps(newProps) {
    if(this.props.searchQuery){
      if(newProps.searchQuery){
        if(JSON.stringify(this.props.searchQuery)!=JSON.stringify(newProps.searchQuery)){
          this._fetchList(newProps.searchQuery);
        }
      }
    }
  }

  _fetchList(searchQuery, callback){
    if(!searchQuery) return;
    const {
      fetchCVs,
      fetchVacancies,
      location,
    } = this.props;
    const fetchFunc = searchQuery.type == 'cv' ? fetchCVs : fetchVacancies;
    let queryString = '';
    for(let key in searchQuery){
      if(searchQuery[key] instanceof Array) {
        const vals = searchQuery[key];
        vals.map(val => {
          queryString += key + '=' + val + '&';
        });
      } else {
          queryString += key + '=' + searchQuery[key] + '&';
      }
    }
    window.history.pushState(location.state, '', `${this.baseUrl}?${queryString}`);
    fetchFunc(searchQuery)
      .then(resp => {
          if(callback) callback(resp);
        }
      );
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
        if(filters[f] == 'salary'){
          if(filters[f].min != filters[f].max) return true;
        } else if (filters[f].length > 0){
          return true;
        }
      }
    }
    return false;
  }

  _toggleFav(itemType, item) {
    if(itemType == 'vacancy') {
      if(!item.favorites) {
        this.props.addVacancyToFavorites({vacancy: item.id});
      } else {
        this.props.removeVacancyFromFavorites(item.favorites);
      }
    } else if(itemType == 'cv') {
      if(!item.favorites) {
        this.props.addCVToFavorites({cv: item.id});
      } else {
        this.props.removeCVFromFavorites(item.favorites);
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
    } else if(type == 'cv') {
      this.props.unselectAllCVs();
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
      } else if(type == 'cv'){
        this.props.addCVListToFavorites({cv_ids: ids});
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
      } else if(type == 'cv') {
        this.props.removeCVListFromFavorites({favorites_ids: favIds});
      }
    }

  }

  render(){
    const { searchQuery, user, filters } = this.props;
    const showFilterPanel = this._shouldShowFilterPanel(filters);
    const listType = searchQuery.type instanceof Array ? searchQuery.type[0] : searchQuery.type;
    const itemsList = listType == 'cv' ? this.props.CVs : this.props.vacancies;
    const sort = searchQuery.sort instanceof Array && searchQuery.sort.length > 0 ? searchQuery.sort[0] : searchQuery.sort;
    return (
      <DashboardGrid user={ user }>
        {/*LEFT SIDEBAR*/}

        { showFilterPanel &&
          <DashboardSidePanel>
              <SearchFilters />
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
                  {gettext(`Знайдено ${listType == 'cv' ? 'резюме' : 'вакансiй'}`)}
                  :&nbsp;<strong>{this.props.listTotalCount || '0'}</strong>
                </p>
                <div className={s.listHeader__sortBox}>
                  <Select
                      searchable={false}
                      label={gettext("Сортувати")}
                      value={sort || 'default'}
                      handleChange={this._handleSort.bind(this)}
                      options={[
                        { value: 'default', label: gettext(' За замовчуванням') },
                        { value: 'date_update', label: gettext('Спочатку новi') },
                        { value: 'salary', label: gettext('Спочатку високооплачуванi') }
                        ]}
                  />
                </div>
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
      </DashboardGrid>
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
    selectedCVs: state.selectedCVs
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUser,
    updateSearchQuery,
    fetchCVs,
    fetchVacancies,
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
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);

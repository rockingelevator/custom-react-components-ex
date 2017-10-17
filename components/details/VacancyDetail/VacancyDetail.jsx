import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import {
  fetchUser
} from '../../../actions/userActions';

import {
  fetchVacancy,
  fetchMoreVacancies,
  addVacancyToFavorites,
  removeVacancyFromFavorites,
} from '../../../actions/vacancyActions';

import {
  updateBreadcrumbs
} from '../../../actions/commonActions';

import DashboardGrid from '../../dashboard/DashboardGrid';
import DashboardSidePanel from '../../dashboard/DashboardSidePanel';
import DashboardContent from '../../dashboard/DashboardContent';
import SidePanelCardsList from '../../lists/SidePanelCardsList';
import VacancyContent from '../../dashboard/VacancyContent';

import s from './VacancyDetail.css';

class VacancyDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrolled: false
    }
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    const { scrollTop } = event.srcElement.body;
    if(scrollTop < 30 && this.state.scrolled) {
      this.setState({scrolled: false});
    } else if(scrollTop >=30 && !this.state.scrolled) {
      this.setState({scrolled: true});
    }
  }

  componentWillMount() {
    const { match, searchQuery, user, vacancy, vacancies } = this.props;

    // fetch user
    if(!user || (user && !user.id)) {
      this.props.fetchUser();
    }

    // fetch vacancy
    const vacancyId = match.params.id_code;
    //this.props.fetchVacancy(vacancyId);

    let breadcrumbs = [];
    if(searchQuery && searchQuery.type == 'vacancy' && vacancies && vacancies.length > 1) { // searchquery always hase type attr, check if there any other entered attr
      // build link to search results
      let queryString = '?';
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
      if(searchQuery.page == 'matching'){
        breadcrumbs.push({
          link: `/dashboard/match/`,
          label: gettext('Результати збігу')
        });
      } else if(searchQuery.page == 'favorites' && searchQuery.type == 'cv') {
        breadcrumbs.push({
          link: `/dashboard/favorites/`,
          label: gettext('Відібрані Резюме')
        });
      } else if(searchQuery.page == 'favorites' && searchQuery.type == 'vacancy') {
        breadcrumbs.push({
          link: `/dashboard/favorites/`,
          label: gettext('Відібрані Вакансії')
        });
      } else {
        breadcrumbs.push({
          link: `/search/${queryString}`,
          label: gettext('Результати пошуку')
        });

      }
    }

    this.props.updateBreadcrumbs(breadcrumbs);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.vacancy.id_code != newProps.match.params.id_code){
        this.props.fetchVacancy(newProps.match.params.id_code);
    }
  }

  _fetchMore() {
    const nextUrl = this.props.listHasMore;
    if(!nextUrl) return;
    const next = nextUrl.split('?')[1];
    this.props.fetchMoreVacancies(next);
  }

  _toggleFav(itemType, item) {
    if(!item.favorites) {
      this.props.addVacancyToFavorites({vacancy: item.id});
    } else {
      this.props.removeVacancyFromFavorites(item.favorites);
    }
  }

  render() {
    const {
      vacancies,
      vacancy,
      searchQuery,
      user
    } = this.props;
    return (
      <DashboardGrid user={ user }>
        {/*LEFT SIDEBAR*/}

        { vacancies && vacancies.length > 0 &&
          <DashboardSidePanel>
            <SidePanelCardsList
              items={vacancies}
              type='vacancy'
              selectedItem={vacancy}
              isMore={this.props.listHasMore}
              fetchMore={this._fetchMore.bind(this)}
              handleChangeActive={this._toggleFav.bind(this)}
              showActions={user && user.role == 'jobseeker'}
              className={this.state.scrolled ? s.sideBarFromTop : ''}
            />
          </DashboardSidePanel>
        }
        {/*CENTRAL CONTENT*/}
            <DashboardContent
              title=""
              breadcrumbs={this.props.breadcrumbs}
            >
              <VacancyContent
                vacancy={vacancy}
                toggleFav={this._toggleFav.bind(this)}
                disableEdit
              />
            </DashboardContent>


        {/*RIGHT SIDEPANEL*/}
        <DashboardSidePanel right>

        </DashboardSidePanel>
      </DashboardGrid>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    vacancy: state.vacancy,
    vacancies: state.vacancies,
    listHasMore: state.isListHasMore,
    breadcrumbs: state.breadcrumbs,
    searchQuery: state.searchQuery
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUser,
    fetchVacancy,
    fetchMoreVacancies,
    updateBreadcrumbs,
    addVacancyToFavorites,
    removeVacancyFromFavorites,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VacancyDetail);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SubNavigation from '../SubNavigation';
import Checkbox from '../../forms/Checkbox';
import Collapsible from 'react-collapsible';

import {
    updateSearchQuery
} from '../../../actions/searchActions';

import {
    fetchFilterFavoritesCVs
} from '../../../actions/cvActions';

import {
    fetchFilterFavoritesVacancies
} from '../../../actions/vacancyActions';

import s from './FavoritesFilters.css';
import sp from '../DashboardSidePanel/DashboardSidePanel.css';
import sbn from '../SubNavigationItem/SubNavigationItem.css';

class FavoritesFilters extends Component {

    constructor(props) {
        super(props);
        this._handleCheckboxChange = this._handleCheckboxChange.bind(this);
        this._isActiveFilter = this._isActiveFilter.bind(this);
    }

    _handleCheckboxChange(filterName, val){

        let searchQuery = {...this.props.searchQuery};

        if(searchQuery[filterName] !== val){
            searchQuery[filterName] = val;

            if(this.props.user.role == 'employer'){
                this.props.fetchFilterFavoritesCVs(val);
            } else {
                this.props.fetchFilterFavoritesVacancies(val);
            }
        } else {
            delete searchQuery[filterName];

            if(this.props.user.role == 'employer'){
                this.props.fetchFilterFavoritesCVs(null);
            } else {
                this.props.fetchFilterFavoritesVacancies(null);
            }
        }
        this.props.updateSearchQuery({...searchQuery});
    }

    _isActiveFilter(filterName, val) {
        /* Return true if filter is currentrly in search query */
        const { searchQuery } = this.props;
        const filterObj = searchQuery[filterName];
        if(filterObj && filterObj == val){
            return true;
        } else if (filterObj === null && val === null) {
            return true;
        }
        return false;
    }

    render() {
        const {
            filters,
            searchQuery,
            user
        } = this.props;

        return (
            <SubNavigation>

                {/* vacancy */}
                {user.role =='employer' && filters.length > 0 ?
                    <Collapsible trigger={
                        <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.experience_specialty && s.filterHeaderWithSet)}>
                            {gettext('Відібрані резюме')}
                        </li>
                    }
                                 open={true} >
                        {
                            filters.map((experienceSpecialty, i) => {
                                return (
                                    <Checkbox
                                        key={'experience-specialty-link-' + i}
                                        label={experienceSpecialty.vacancy__header}
                                        className={s.searchFilters__checkbox}
                                        info={experienceSpecialty.vacancy_id}
                                        isChecked={this._isActiveFilter('selected_resumes', experienceSpecialty.vacancy_id)}
                                        handleChange={e => { this._handleCheckboxChange('selected_resumes', experienceSpecialty.vacancy_id) }}
                                    />
                                );
                            })
                        }

                    </Collapsible>
                    : ''
                }

                {/* cv */}
                {filters.length > 0 && user.role =='jobseeker' ?
                    <Collapsible
                        trigger={
                            <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.experience_specialty && s.filterHeaderWithSet)}>
                                {gettext('Відібрані Вакансії')}
                            </li>
                        }
                        open={true}
                    >
                        {
                            filters.map((experienceSpecialty, i) => {
                                return (
                                    <Checkbox
                                        key={'experience-specialty-link-' + i}
                                        label={experienceSpecialty.cv__header}
                                        className={s.searchFilters__checkbox}
                                        info={experienceSpecialty.cv_id}
                                        isChecked={this._isActiveFilter('selected_cv', experienceSpecialty.cv_id)}
                                        handleChange={e => { this._handleCheckboxChange('selected_cv', experienceSpecialty.cv_id) }}
                                    />
                                );
                            })
                        }

                    </Collapsible>
                    : '' }

            </SubNavigation>
        )
    }
}

function mapStateToProps(state) {
    return {
        filters: state.searchFilters,
        searchQuery: state.searchQuery
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateSearchQuery,
        fetchFilterFavoritesCVs,
        fetchFilterFavoritesVacancies
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesFilters);

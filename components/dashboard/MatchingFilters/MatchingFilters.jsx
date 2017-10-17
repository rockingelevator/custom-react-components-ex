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
    fetchMatchingCVsCount,
    fetchMatchingVacanciesCount
} from '../../../actions/matchingActions';

import {
    fetchMatchingCVs
} from '../../../actions/cvActions';

import {
    fetchMatchingVacancies
} from '../../../actions/vacancyActions';

import s from './MatchingFilters.css';
import sp from '../DashboardSidePanel/DashboardSidePanel.css';
import sbn from '../SubNavigationItem/SubNavigationItem.css';

class FavoritesFilters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            matching_count: []
        };
        this._handleCheckboxChange = this._handleCheckboxChange.bind(this);
        this._isActiveFilter = this._isActiveFilter.bind(this);
    }

    componentWillMount(){
        var that = this;
        if(this.props.filters){
            this.props.filters.map((item)=>{
                if(this.props.user.role == 'employer'){
                    this.props.fetchMatchingCVsCount(item.id_code).then(resp => {
                        if(resp.payload.status == 200){
                            // matching_count
                            that.setState({...that.state.matching_count.push({
                                id: item.id_code,
                                count: resp.payload.data.matching_count
                            })});
                        }
                    });
                } else {
                    this.props.fetchMatchingVacanciesCount(item.id_code).then(resp => {
                        if(resp.payload.status == 200){
                            // matching_count

                            that.setState({...that.state.matching_count.push({
                                id: item.id_code,
                                count: resp.payload.data.matching_count
                            })});
                        }
                    });
                }
            });
        }
    }

    _handleCheckboxChange(filterName, val, count){

        let searchQuery = {...this.props.searchQuery};

        if(searchQuery[filterName] !== val){
            searchQuery[filterName] = val;

            if(this.props.user.role == 'employer'){
                this.props.fetchMatchingCVs(val);
            } else {
                this.props.fetchMatchingVacancies(val);
            }
            this.props.SelectedFilter(val, count);
        } else {
            delete searchQuery[filterName];

            if(this.props.user.role == 'employer'){
                this.props.fetchMatchingCVs();
            } else {
                this.props.fetchMatchingVacancies();
            }
            this.props.SelectedFilter(val, 0);
        }
        searchQuery['page'] = 'matching';
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
                            {gettext('Стосовно Вакансії')}
                        </li>
                    }
                                 open={true} >
                        {
                            filters.map((experienceSpecialty, i) => {
                                return this.state.matching_count.map(item => {
                                    if(item.id == experienceSpecialty.id_code) {
                                        return (
                                            <Checkbox
                                                key={'experience-specialty-link-' + i}
                                                label={experienceSpecialty.header}
                                                className={s.searchFilters__checkbox}
                                                info={item.count}
                                                isChecked={this._isActiveFilter('selected_resumes', experienceSpecialty.id_code)}
                                                handleChange={e => { this._handleCheckboxChange('selected_resumes', experienceSpecialty.id_code, item.count) }}
                                            />
                                        );
                                    }
                                });
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
                                {gettext('Стосовно резюме')}
                            </li>
                        }
                        open={true}
                    >
                        {
                            filters.map((experienceSpecialty, i) => {
                                return this.state.matching_count.map(item => {
                                    if(item.id == experienceSpecialty.id_code) {
                                        return (
                                            <Checkbox
                                                key={'experience-specialty-link-' + i}
                                                label={experienceSpecialty.header}
                                                className={s.searchFilters__checkbox}
                                                info={item.count}
                                                isChecked={this._isActiveFilter('selected_cv', experienceSpecialty.id_code)}
                                                handleChange={e => { this._handleCheckboxChange('selected_cv', experienceSpecialty.id_code, item.count) }}
                                            />
                                        );
                                    }
                                });
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
        searchQuery: state.searchQuery,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateSearchQuery,
        fetchMatchingCVs,
        fetchMatchingVacancies,
        fetchMatchingCVsCount,
        fetchMatchingVacanciesCount
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesFilters);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SubNavigation from '../../dashboard/SubNavigation';
import Button from '../../forms/Button';
import Checkbox from '../../forms/Checkbox';
import Collapsible from 'react-collapsible';
import Select from '../../forms/Select';
import Slider from '../../forms/Slider';

import {
  updateSearchQuery
} from '../../../actions/searchActions';

import s from './SearchFilters.css';
import sp from '../../dashboard/DashboardSidePanel/DashboardSidePanel.css';
import sbn from '../../dashboard/SubNavigationItem/SubNavigationItem.css';

class SearchFilters extends Component {

  constructor(props) {
    super(props);
    this._handleCheckboxChange = this._handleCheckboxChange.bind(this);
    this._isActiveFilter = this._isActiveFilter.bind(this);
  }

  _handleSalaryChange(val) {
    this.props.updateSearchQuery({
      ...this.props.searchQuery,
      salary_min: val[0],
      salary_max: val[1]
    });
  }

  _generateSalaryMarks(val){
    let rangeMarks = {};
    if(val) {
      let k = Math.round((val.max-val.min)/3);
      k = Math.round(k/10) * 10;
      rangeMarks[val.min] = val.min;
      rangeMarks[val.min + k] = val.min + k;
      rangeMarks[val.min + 2 * k] = val.min + 2 * k;
      rangeMarks[val.max] = val.max;
    }
    return rangeMarks;
  }

  _handleCheckboxChange(filterName, val){
    let filter = this.props.searchQuery[filterName] ? [...this.props.searchQuery[filterName]] : [];
    let searchQuery = {...this.props.searchQuery};
    if(filter){
      let valIndex = -1;
      for (let i in filter){
        if(decodeURIComponent(filter[i]) == val){
          valIndex = i;
          break;
        }
      }
      if(valIndex < 0) {
        filter.push(val);
      } else {
        filter.splice(valIndex, 1);
      }
    } else {
      filter = [val];
    }
    if(filter.length > 0){
      searchQuery[filterName] = filter;
    } else {
      delete searchQuery[filterName];
    }
    this.props.updateSearchQuery({...searchQuery});
  }

  _isActiveFilter(filterName, val) {
    /* Return true if filter is currentrly in search query */
    const { searchQuery } = this.props;
    const filterObj = searchQuery[filterName];
    if(filterObj){
      for(let i in filterObj){
        if(decodeURIComponent(filterObj[i]) == val) return true;
      }
    }
    return false;
  }

  render() {
    const {
      filters,
      searchQuery
    } = this.props;

    const rangeMarks = this._generateSalaryMarks(filters.salary);

    return (
      <SubNavigation>

        {/* SALARY RANGE */}
        {filters.salary && filters.salary.min != filters.salary.max &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.salary_max && s.filterHeaderWithSet)}>
                {gettext('Зарплата')}
              </li>
            }
            open={true}
          >
            <div className={s.rangeWrapper}>
              <Slider
                range={true}
                min={filters.salary.min}
                max={filters.salary.max}
                step={10}
                marks={
                  rangeMarks
                }
                allowCross={false}
                defaultValue={[
                  parseInt(searchQuery.salary_min || filters.salary.min),
                  parseInt(searchQuery.salary_max || filters.salary.max)
                ]}
                onAfterChange={this._handleSalaryChange.bind(this)}
              />
            </div>
          </Collapsible>
        }

        {/* EXPERIENCE SPECIALTY */}
        {filters.experience_specialty && filters.experience_specialty.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.experience_specialty && s.filterHeaderWithSet)}>
                {gettext('Досвід роботи')}
              </li>
            }
            open={true}
          >
            {
              filters.experience_specialty.map((experienceSpecialty, i) => {
                return (
                  <Checkbox
                    key={'experience-specialty-link-' + i}
                    label={experienceSpecialty[2]}
                    className={s.searchFilters__checkbox}
                    info={experienceSpecialty[1]}
                    isChecked={this._isActiveFilter('experience_specialty', experienceSpecialty[0])}
                    handleChange={e => { this._handleCheckboxChange('experience_specialty', experienceSpecialty[0]) }}
                  />
                );
              })
            }

          </Collapsible>
        }

        {/* EMPLOYMENT TYPE */}
        {filters.employment_type && filters.employment_type.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.employment_type && s.filterHeaderWithSet)}>
                {gettext('Тип зайнятості')}
              </li>
            }
            open={true}
          >
            {
              filters.employment_type.map((employmentType, i) => {
                return (
                  <Checkbox
                    key={'employment-type-link-' + i}
                    label={employmentType[2]}
                    info={employmentType[1]}
                    className={s.searchFilters__checkbox}
                    isChecked={this._isActiveFilter('employment_type', employmentType[0])}
                    handleChange={e => { this._handleCheckboxChange('employment_type', employmentType[0]) }}
                  />
                );
              })
            }
          </Collapsible>
        }

        {/* TIME SCHEDULES */}
        {filters.time_schedules && filters.time_schedules.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.time_schedules && s.filterHeaderWithSet)}>
                {gettext('Графік роботи')}
              </li>
            }
            open={true}
          >
            {
              filters.time_schedules.map((timeSchedule, i) => {
                return (
                  <Checkbox
                    key={'time-schedule-link-' + i}
                    label={timeSchedule[2]}
                    info={timeSchedule[1]}
                    className={s.searchFilters__checkbox}
                    isChecked={this._isActiveFilter('time_schedules', timeSchedule[0])}
                    handleChange={e => { this._handleCheckboxChange('time_schedules', timeSchedule[0]) }}
                  />
                );
              })
            }

          </Collapsible>
        }

        {/* SCOPE ACTIVITY */}
        {filters.scope_activity && filters.scope_activity.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.scope_activity && s.filterHeaderWithSet)}>
                {gettext('Галузь компанії')}
              </li>
            }
            open={true}
          >
            {
              filters.scope_activity.map((scopeActivity, i) => {
                return (
                  <Checkbox
                    key={'scope-activity-link-' + i}
                    label={scopeActivity[2]}
                    info={scopeActivity[1]}
                    className={s.searchFilters__checkbox}
                    isChecked={this._isActiveFilter('scope_activity', scopeActivity[0])}
                    handleChange={e => { this._handleCheckboxChange('scope_activity', scopeActivity[0]) }}
                  />
                );
              })
            }
          </Collapsible>
        }

        {/* SKILLS */}
        {filters.skills && filters.skills.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.skills && s.filterHeaderWithSet)}>
                {gettext('Навички')}
              </li>
            }
            open={true}
          >
            {
              filters.skills.map((skill, i) => {
                return (
                  <Checkbox
                    key={'skill-link-' + i}
                    label={skill[2]}
                    info={skill[1]}
                    className={s.searchFilters__checkbox}
                    isChecked={this._isActiveFilter('skills', skill[0])}
                    handleChange={e => { this._handleCheckboxChange('skills', skill[0]) }}
                  />
                );
              })
            }
          </Collapsible>
        }

        {/* POSITIONS */}
        {filters.positions && filters.positions.length > 0 &&
          <Collapsible
            trigger={
              <li className={sp.sidepanel__title + ' ' + sbn.subnavigation__item + ' ' + (searchQuery.positions && s.filterHeaderWithSet)}>
                {gettext('Посади')}
              </li>
            }
            open={true}
          >
            {
              filters.positions.map((position, i) => {
                return (
                  <Checkbox
                    key={'skill-link-' + i}
                    label={position[2]}
                    info={position[1]}
                    className={s.searchFilters__checkbox}
                    isChecked={this._isActiveFilter('positions', position[0])}
                    handleChange={e => { this._handleCheckboxChange('positions', position[0]) }}
                  />
                );
              })
            }
          </Collapsible>
        }

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
    updateSearchQuery
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);

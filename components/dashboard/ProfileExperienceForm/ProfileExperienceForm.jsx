import React, { Component } from 'react';
import Select from '../../forms/Select';
import TextInput from '../../forms/TextInput';
import TextArea from '../../forms/TextArea';
import LayerOpener from '../../forms/LayerOpener';
import FormFooter from '../../forms/FormFooter';
import { months, oldAge, yearStartJob } from '../../../constants';

import s from './ProfileExperienceForm.css';

export default class ProfileExperienceForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      jobs: null,
      errors: {}
    };
    this.indexBlockFocus = null;
    this.yearToday = new Date().getUTCFullYear();
    this.startYear = this.yearToday;
    this.endYear = this.yearToday - oldAge + yearStartJob;
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handlePositionsSelection = this._handlePositionsSelection.bind(this);
    this._removeExperienceBlock = this._removeExperienceBlock.bind(this);
  }

  componentWillMount(){
    this.indexBlockFocus = 0;
    if(this.props.handleFormInit)
      this.props.handleFormInit(gettext('Професiйний досвiд')); //pass form title to parent component
    this.props.fetchPositions(); //initial fetching of options for position select
    if(this.props.user)
      this.setState({jobs: this.props.user.jobs});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.jobs && newProps.user) {
      this.indexBlockFocus = 0;
      this.setState({jobs: newProps.user.jobs});
    }
    if (newProps.user && newProps.user.birthday) {
      let birthday = new Date(newProps.user.birthday);
      this.endYear = birthday.getUTCFullYear() + yearStartJob;
    }
    if(newProps.errors) {
      // seting initial data to component state
      this.setState({errors: newProps.errors});
    }
  }

  componentDidUpdate() {
    this.indexBlockFocus = null
  }

  _handlePositionsSelection(val, i) {
    let selectedJobs = this.state.jobs;
    selectedJobs[i].position = val.value;
    this.setState({jobs: selectedJobs});
  }

  _handleChange(field, val, i, type) {
    let date = new Date();
    let current_field;
    let selectedJobs = this.state.jobs;
    let job = selectedJobs[i];

    if (val && (field == 'start_date' || field == 'end_date')) {
      let index = type === 'month' ? 1 : 0;
      let old_val = job[field] || '--01';
      let new_val = old_val.split('-');
      new_val[index] = val.value + (index ? 1: 0);
      if (field == 'start_date') {
        current_field = index === 1 ? 'start_month': 'start_year';
      } else {
        current_field = index === 1 ? 'end_month': 'end_year';
      }
      job[field] = new_val.join('-');
      job[current_field] = val.value;

      if (job.start_year != null && job.end_year != null && job.start_month != null && job.end_month != null
        && job.start_year == job.end_year && job.start_month > job.end_month) {
        job.start_month = null;
        job.end_month = null;
        let newStartDate = job.start_date.split('-');
        newStartDate[1] = '';
        let newEndDate = job.end_date.split('-');
        newEndDate[1] = '';
        job.start_date = newStartDate.join('-');
        job.end_date = newEndDate.join('-');
      }

    } else {
      job[field] = val;
    }
    selectedJobs[i] = job;
    this.setState({jobs: selectedJobs});
  }

  _addExperienceBlock(e) {
    this.setState({errors: {}});
    this.setState({jobs: [...this.state.jobs, {
      company: '',
      responsibilitie: '',
      start_date: '--01',
      end_date: '--01',
      position: null,
      start_month: null,
      start_year: null,
      end_month: null,
      end_year: null,
    } ]});
    this.indexBlockFocus = this.state.jobs.length
  }

  _removeExperienceBlock(i){
    this.setState({errors: {}});
    let selectedJobs = this.state.jobs;
    selectedJobs.splice(i, 1);
    this.setState({
      jobs: selectedJobs
    });
  }

  _handleSubmit(){
    this.props.handleSubmit('experience', this.state.jobs);
  }

  _generateStartMonthOptions(index){
    let selectedJob = this.state.jobs[index];
    let startMonth = 0;
    let endMonth = 11;
    if (selectedJob.end_year && selectedJob.end_month && selectedJob.end_year == selectedJob.start_year) {
      endMonth = selectedJob.end_month
    }

    let monthToday = new Date().getUTCMonth();
    if (selectedJob.start_year == this.yearToday && monthToday < endMonth) {
      endMonth = monthToday
    }

    let options = [];
    for (let i = startMonth; i <= endMonth; i++) {
      options.push({label: months[i], value: i});
    }
    return options;
  }

  _generateEndMonthOptions(index){
    let selectedJob = this.state.jobs[index];
    let startMonth = 0;
    let endMonth = 11;
    if (selectedJob.start_year && selectedJob.start_month && selectedJob.start_year == selectedJob.end_year) {
      startMonth = selectedJob.start_month
    }

    if (selectedJob.end_year == this.yearToday || selectedJob.start_year == this.yearToday) {
      endMonth = new Date().getUTCMonth();
      if (selectedJob.start_year == this.yearToday && selectedJob.start_month) {
        startMonth = selectedJob.start_month
      }
    }

    let options = [];
    for (let i = startMonth; i <= endMonth; i++) {
      options.push({label: months[i], value: i});
    }
    return options;
  }

  _generateStartYearOptions(index){
    let selectedJob = this.state.jobs[index];
    let options = [];
    let startYear = selectedJob.end_year ? selectedJob.end_year : this.startYear;
    let endYear = this.endYear;

    for (let i = startYear; i >= endYear; i--) {
      options.push({label: i, value: i});
    }
    return options;
  }

  _generateEndYearOptions(index){
    let selectedJob = this.state.jobs[index];
    let options = [];
    let startYear = this.startYear;
    let endYear = selectedJob.start_year ? selectedJob.start_year : this.endYear;

    for (let i = startYear; i >= endYear; i--) {
      options.push({label: i, value: i});
    }
    return options;
  }

  _handlePositionCreate(e) {
    return {
      label: e.label,
      value: e.label
    }
  }

  render() {
    const { jobs } = this.state;
    const { errors } = this.state;
    return (
      <div>
        {
          jobs && jobs.map((job, i) => {
            return (
              <div key={'experience-' + i} className={ 'formLayerRow  ' + (i % 2 == 1 ? 'evenrow' : '')}>
                <TextInput
                  name={'company_' + i}
                  label={gettext("Компанія/роботодавець")}
                  value={job.company}
                  handleChange={(e) => {this._handleChange('company', e.target.value, i)}}
                  handleFieldErrors={this.props.handleErrors}
                  validation={['required']}
                  errors={errors['company_' + i] || (errors[i] && errors[i].company)}
                  inputRef={el => {
                    if (i == this.indexBlockFocus && el) {el.focus()}
                  }}
                />
                <Select
                  value={job.position}
                  label={gettext('Посада')}
                  placeholder={gettext('Оберiть')}
                  handleChange={(val) => {this._handlePositionsSelection(val, i)}}
                  newOptionCreator={this._handlePositionCreate.bind(this)}
                  options={this.props.positionOptions}
                  errors={errors[i] && errors[i].position}
                  creatable
                />
                <div className={'selectWrapper ' + (errors[i] && (errors[i].start_date || errors[i].end_date) ? ' error' : '')}>
                  <label className='inputLabel inputLabel_default'>{gettext('Період роботи')}</label>
                  <div className='groupSelects groupSelects_clearfix'>
                    <div className='groupSelects__block'>
                    <Select
                      label=""
                      name="month"
                      value={job.start_month}
                      options={this._generateStartMonthOptions(i)}
                      handleChange={(e) => {this._handleChange('start_date', e, i, 'month')}}
                      clearable={false}
                      placeholder={gettext("Мicяць")}
                    />
                    <Select
                      label=""
                      name="year"
                      value={job.start_year}
                      options={this._generateStartYearOptions(i)}
                      handleChange={(e) => {this._handleChange('start_date', e, i, 'year')}}
                      clearable={false}
                      placeholder={gettext("Рік")}
                    />
                    {errors[i] && errors[i].start_date &&
                      <ul className={s.errorList}>
                        {
                          errors[i].start_date.map((error, i) => {
                            return (
                                <li key={"error-" + i}>{error}</li>
                            )
                          })
                        }
                      </ul>
                    }
                    </div>
                    <div className='groupSelects__block'>
                    <Select
                      label=""
                      name="month"
                      value={job.end_month}
                      options={this._generateEndMonthOptions(i)}
                      handleChange={(e) => {this._handleChange('end_date', e, i, 'month')}}
                      clearable={false}
                      placeholder={gettext("Мicяць")}
                    />
                    <Select
                      label=""
                      name="year"
                      value={job.end_year}
                      options={this._generateEndYearOptions(i)}
                      handleChange={(e) => {this._handleChange('end_date', e, i, 'year')}}
                      clearable={false}
                      placeholder={gettext("Рік")}
                    />
                    {errors[i] && errors[i].end_date &&
                      <ul className={s.errorList}>
                        {
                          errors[i].end_date.map((error, i) => {
                            return (
                                <li key={"error-" + i}>{error}</li>
                            )
                          })
                        }
                      </ul>
                    }
                    </div>
                  </div>
                </div>

                <TextArea
                    name={'responsibilitie_' + i}
                    label={gettext("Виконувані обов'язки")}
                    value={job.responsibilitie}
                    handleChange={(e) => {this._handleChange('responsibilitie', e.target.value, i)}}
                    errors={errors['responsibilitie_' + i] || (errors[i] && errors[i].responsibilitie)}
                    handleFieldErrors={this.props.handleErrors}
                    validation={['required']}
                />
                <a
                    className='formlink'
                    onClick={e => this._removeExperienceBlock(i)}
                >
                  <i className='icon-cancel'/> {gettext('Видалити')}
                </a>
              </div>
            )
          })
        }

        <LayerOpener
          label={gettext("+ Додати досвiд")}
          handleClick={this._addExperienceBlock.bind(this)}
        />
        <FormFooter
          handleSubmit={this._handleSubmit}
          handleCancel={this.props.handleCancel}
          fetching={this.props.fetching}
        />
      </div>
    )
  }
}

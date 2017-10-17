import React, { Component } from 'react';
import Select from '../../forms/Select';
import LayerOpener from '../../forms/LayerOpener';
import FormFooter from '../../forms/FormFooter';
import { oldAge, yearEnrollment, yearEnding } from '../../../constants';
import s from './ProfileGraduationForm.css';

export default class ProfileGraduationForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      educationInstitutions: null,
      errors: {},
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleSelection = this._handleSelection.bind(this);
    this._removeGraduation = this._removeGraduation.bind(this);
  }

  componentWillMount(){
    if(this.props.handleFormInit)
      this.props.handleFormInit(gettext('Освiта')); //pass form title to parent component
    if(this.props.levelInstitutionsOptions.length < 1)
      this.props.fetchLevelInstitutions(); //initial fetching of options for level select
    if(this.props.institutionOptions.length < 1)
      this.props.fetchInstitutions(); //initial fetching of options for institution select
    if(this.props.user)
      this.setState({educationInstitutions: this.props.user.education_institutions});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.educationInstitutions && newProps.user)
      // seting initial data to component state
      this.setState({
        educationInstitutions: newProps.user.education_institutions,
      });
    if(newProps.errors)
      // seting initial data to component state
      this.setState({errors: newProps.errors});
  }

  _handleSelection(field, val, i) {
    let selectedEducationInstitutions = this.state.educationInstitutions;
    selectedEducationInstitutions[i][field] = val.value;
    this.setState({educationInstitutions: selectedEducationInstitutions});
  }

  _addGraduation(e) {
    this.setState({errors: {}});
    this.setState({educationInstitutions: [...this.state.educationInstitutions, {
      level: null,
      start_year: null,
      end_year: null,
      institution: null
    } ]});
  }

  _removeGraduation(i){
    this.setState({errors: {}});
    let selectedEducationInstitutions = this.state.educationInstitutions;
    selectedEducationInstitutions.splice(i, 1);
    this.setState({educationInstitutions: selectedEducationInstitutions});
  }

  _handleSubmit(){
    this.props.handleSubmit('graduation', this.state.educationInstitutions);
  }

  _generateYearOptions(val){
    let options = [];
    let yearToday = new Date().getUTCFullYear();
    let startYear = yearToday - oldAge + val;
    if (this.props.user.birthday){
      let yearBirthday = new Date(this.props.user.birthday).getFullYear();
      startYear = yearBirthday + val;
    }
    for (let i = yearToday; i >= startYear; i--) {
      options.push({label: i, value: i});
    }
    return options;
  }

  render() {
    const { educationInstitutions } = this.state;
    const { errors } = this.state;
    return (
      <div>
        {
          educationInstitutions && educationInstitutions.map((edInst, i) => {
            return (
              <div key={'graduation-' + i} className={'formLayerRow  ' + (i % 2 == 1 ? 'evenrow' : '')}>
                <Select
                  value={edInst.level}
                  label={gettext('Рівень освіти')}
                  placeholder=''
                  handleChange={(val) => {this._handleSelection('level', val, i)}}
                  options={this.props.levelInstitutionsOptions}
                  errors={errors[i] && errors[i].level}
                />

                <Select
                  value={edInst.institution || edInst.institution_id}
                  label={gettext('Назва навчального закладу')}
                  placeholder=''
                  handleChange={(val) => {this._handleSelection('institution', val, i)}}
                  options={this.props.institutionOptions}
                  errors={errors[i] && errors[i].institution}
                />

                <label className='inputLabel inputLabel_default'>{gettext('Роки навчання')}</label>
                <div className="formrow">
                  <div className="halfrow">
                    <Select
                      value={edInst.start_year}
                      label=''
                      placeholder={gettext('Вступ')}
                      handleChange={(val) => {this._handleSelection('start_year', val, i)}}
                      options={this._generateYearOptions(yearEnrollment)}
                      errors={errors[i] && errors[i].start_year}
                    />
                  </div>
                  <div className="halfrow">
                    <Select
                      value={edInst.end_year}
                      label=''
                      placeholder={gettext('Закінчення')}
                      handleChange={(val) => {this._handleSelection('end_year', val, i)}}
                      options={this._generateYearOptions(yearEnding)}
                      errors={errors[i] && errors[i].end_year}
                    />
                  </div>
                </div>
                <a
                    className='formlink'
                    onClick={e => this._removeGraduation(i)}
                >
                  <i className='icon-cancel'/> {gettext('Видалити')}
                </a>
              </div>
            )
          })
        }
        <LayerOpener
          label={gettext("+ Додати учбовий заклад")}
          handleClick={this._addGraduation.bind(this)}
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

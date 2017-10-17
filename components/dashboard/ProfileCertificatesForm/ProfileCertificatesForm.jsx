import React, { Component } from 'react';
import Select from '../../forms/Select';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import LayerOpener from '../../forms/LayerOpener';
import { oldAge } from '../../../constants';

import s from './ProfileCertificatesForm.css';

export default class ProfileCertificatesForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      educationCertificates: null,
      errors: {}
    };
    this.indexBlockFocus = null;
    this.yearEnding = 15; // не ранее 15 лет от дня рождения
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleSelection = this._handleSelection.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._removeCertificate = this._removeCertificate.bind(this);
  }

  componentWillMount(){
    this.indexBlockFocus = 0;
    if(this.props.handleFormInit)
      this.props.handleFormInit(gettext('Курси')); //pass form title to parent component
    this.setState({educationCertificates: this.props.user.education_certificates});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.educationCertificates && newProps.user)
      // seting initial data to component state
      this.setState({
        educationCertificates: newProps.user.education_certificates,
      });
      this.indexBlockFocus = 0;
    if(newProps.errors)
      // seting initial data to component state
      this.setState({errors: newProps.errors});
  }

  componentDidUpdate() {
    this.indexBlockFocus = null
  }

  _handleSelection(field, val, i) {
    let selectedEducationCertificates = this.state.educationCertificates;
    selectedEducationCertificates[i][field] = val.value;
    this.setState({educationCertificates: selectedEducationCertificates});
  }

  _handleChange(field, val, i) {
    let selectedEducationCertificates = [...this.state.educationCertificates];
    selectedEducationCertificates[i][field] = val;
    selectedEducationCertificates[i].name = val;
    this.setState({educationCertificates: selectedEducationCertificates});
  }

  _addCertificate(e) {
    this.setState({errors: {}});
    this.setState({educationCertificates: [...this.state.educationCertificates, {
      certificate: '',
      year: null,
    } ]});
    this.indexBlockFocus = this.state.educationCertificates.length;
  }

  _removeCertificate(i){
    this.setState({errors: {}});
    let selectedEducationCertificates = this.state.educationCertificates;
    selectedEducationCertificates.splice(i, 1);
    this.setState({
      educationCertificates: selectedEducationCertificates
    });
  }

  _handleSubmit(){
    this.props.handleSubmit('certificates', this.state.educationCertificates);
  }

  _generateYearOptions(){
    let options = [];
    let yearToday = new Date().getUTCFullYear();
    let startYear = yearToday - oldAge + this.yearEnding;
    if (this.props.user.birthday){
      let yearBirthday = new Date(this.props.user.birthday).getFullYear();
      startYear = yearBirthday + this.yearEnding;
    }
    for (let i = yearToday; i >= startYear; i--) {
      options.push({label: i, value: i});
    }
    return options;
  }

  render() {
    const { educationCertificates } = this.state;
    const { errors } = this.state;
    return (
      <div>
        {
          educationCertificates && educationCertificates.map((edCertificate, i) => {
            return (
              <div key={'certificates-' + i} className={'formLayerRow  ' + (i % 2 == 1 ? 'evenrow' : '')}>
                <TextInput
                  label={gettext("Назва сертифікату")}
                  value={edCertificate.name || edCertificate.certificate}
                  handleChange={(e) => {this._handleChange('certificate', e.target.value, i)}}
                  errors={errors[i] && errors[i].certificate}
                  inputRef={el => {
                    if (i == this.indexBlockFocus && el) {el.focus()}
                  }}
                />

                  {!this.props.hideDates &&
                    <Select
                        value={edCertificate.year}
                        label={gettext('Рік отримання')}
                        placeholder={gettext('вкажіть рік')}
                        handleChange={(val) => {this._handleSelection('year', val, i)}}
                        options={this._generateYearOptions()}
                        className={s.halfInput}
                        errors={errors[i] && errors[i].year}
                    />
                  }

                <a
                    className='formlink'
                    onClick={e => this._removeCertificate(i)}
                >
                  <i className='icon-cancel'/> {gettext('Видалити')}
                </a>
              </div>
            )
          })
        }

        <LayerOpener
            label={gettext("+ Додати сертифікат")}
            handleClick={this._addCertificate.bind(this)}
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

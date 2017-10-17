import React, { Component } from 'react';
import Select from '../../forms/Select';
import LayerOpener from '../../forms/LayerOpener';
import FormFooter from '../../forms/FormFooter';

import s from './ProfileLanguagesForm.css';


export default class ProfileLanguagesForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      languageSkills: null,
      errors: {}
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleLanguageSelection = this._handleLanguageSelection.bind(this);
    this._handleSkillSelection = this._handleSkillSelection.bind(this);
    this._removeLanguageSkill = this._removeLanguageSkill.bind(this);
  }

  componentWillMount(){
    if(this.props.handleFormInit)
      this.props.handleFormInit(gettext('Володiння мовами')); //pass form title to parent component
    if(this.props.languageOptions.length < 1)
      this.props.fetchLanguages(); //initial fetching of options for language select
    if(this.props.languageSkillOptions.length < 1)
      this.props.fetchLanguageSkills(); //initial fetching of options for skill select
    if(this.props.user)
      this.setState({languageSkills: this.props.user.language_skills});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.languageSkills && newProps.user)
      // seting initial data to component state
      this.setState({languageSkills: newProps.user.language_skills});
    if(newProps.errors)
      // seting initial data to component state
      this.setState({errors: newProps.errors});
  }

  _handleLanguageSelection(val, i) {
    let selectedLanguages = this.state.languageSkills;
    selectedLanguages[i].language = val.value;
    this.setState({languageSkills: selectedLanguages});
  }

  _handleSkillSelection(val, i) {
    let selectedLanguages = this.state.languageSkills;
    selectedLanguages[i].skill = val.value;
    this.setState({languageSkills: selectedLanguages});
  }

  _addLanguageSkill(e) {
    this.setState({errors: {}});
    this.setState({languageSkills: [...this.state.languageSkills, {
      language: null, skill: null
    } ]});
  }

  _removeLanguageSkill(i){
    this.setState({errors: {}});
    let selectedLanguages = this.state.languageSkills;
    selectedLanguages.splice(i, 1);
    this.setState({languageSkills: selectedLanguages});
  }

  _handleSubmit(){
    this.props.handleSubmit('languages', this.state.languageSkills);
  }

  _generateLanguageOptions(lang){
    let languages = [];
    let languageSkills = this.state.languageSkills;
    let languageOptions = this.props.languageOptions;

    languageSkills.map((el, index) => {
      languageOptions.map((el2) => {
        if (el.language !== el2.value || lang.language === el2.value) {
          languages.push(el2);
        }
      });
      languageOptions = languages;
      if (languageSkills.length - 1 !== index) {
        languages = [];
      }
    });
    return languages;
  }

  render() {
    const { languageSkills } = this.state;
    const { errors } = this.state;
    return (
      <div>
        <div className={s.skillraw}>
          <label className={'inputLabel ' + s.halfInput}>{gettext('Мова')}</label>
          <label className={'inputLabel ' + s.halfInput}>{gettext('Рiвень володiння')}</label>
        </div>
        {
          languageSkills && languageSkills.map((lang, i) => {
            return (
              <div key={'language_skill-' + i} className={s.skillraw}>
                <Select
                  value={lang.language}
                  label=''
                  placeholder={gettext('Оберiть мову')}
                  handleChange={(val) => {this._handleLanguageSelection(val, i)}}
                  options={this._generateLanguageOptions(lang)}
                  className={s.halfInput}
                  errors={errors[i] && (errors[i].language_errors || errors[i].language)}
                />
                <Select
                  value={lang.skill}
                  label=''
                  placeholder={gettext('Оберiть рiвень')}
                  handleChange={(val) => {this._handleSkillSelection(val, i)}}
                  options={this.props.languageSkillOptions}
                  className={s.halfInput + ' ' + s.skillselect}
                  errors={errors[i] && (errors[i].skill_errors || errors[i].skill)}
                />
              <a
                className='removeRowIcon'
                onClick={e => this._removeLanguageSkill(i)}
              >
                <i className='icon-cancel'/>
              </a>
              </div>
            )
          })
        }
        <LayerOpener
          label={gettext('+ Додати мову')}
          handleClick={this._addLanguageSkill.bind(this)}
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

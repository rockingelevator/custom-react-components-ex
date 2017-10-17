import React, { Component } from 'react';
import Select from '../../forms/Select';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import LayerOpener from '../../forms/LayerOpener';
import { oldAge } from '../../../constants';

import s from './ProfileCoursesForm.css';

export default class ProfileCoursesForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      educationCourses: null,
      errors: {}
    };
    this.indexBlockFocus = null;
    this.yearEnding = 15; // не ранее 15 лет от дня рождения
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleSelection = this._handleSelection.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._removeCourse = this._removeCourse.bind(this);
  }

  componentWillMount(){
    this.indexBlockFocus = 0;
    if(this.props.handleFormInit)
      this.props.handleFormInit(gettext('Курси')); //pass form title to parent component
    if(this.props.user)
        this.setState({educationCourses: this.props.user.education_courses});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.educationCourses && newProps.user)
      // seting initial data to component state
      this.setState({
        educationCourses: newProps.user.education_courses,
      });
    if(newProps.errors)
      // seting initial data to component state
      this.setState({errors: newProps.errors});
  }

  componentDidUpdate() {
    this.indexBlockFocus = null
  }

  _handleSelection(field, val, i) {
    let selectedEducationCourses = this.state.educationCourses;
    selectedEducationCourses[i][field] = val.value;
    this.setState({educationCourses: selectedEducationCourses});
  }

  _handleChange(field, val, i) {
    let selectedEducationCourses = [...this.state.educationCourses];
    selectedEducationCourses[i][field] = val;
    selectedEducationCourses[i].name = val;
    this.setState({educationCourses: selectedEducationCourses});
  }

  _addCourse(e) {
    this.setState({errors: {}});
    this.setState({educationCourses: [...this.state.educationCourses, {
      course: '',
      end_year: null,
    } ]});
    this.indexBlockFocus = this.state.educationCourses.length
  }

  _removeCourse(i){
    this.setState({errors: {}});
    let selectedEducationCourses = this.state.educationCourses;
    selectedEducationCourses.splice(i, 1);
    this.setState({
      educationCourses: selectedEducationCourses
    });
  }

  _handleSubmit(){
    this.props.handleSubmit('courses', this.state.educationCourses);
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
    const { educationCourses } = this.state;
    const { errors } = this.state;
    return (
      <div>
        {
          educationCourses && educationCourses.map((edCourse, i) => {
            return (
              <div key={'courses-' + i} className={'formLayerRow  ' + (i % 2 == 1 ? 'evenrow' : '')}>
                <TextInput
                  name={'course_' + i}
                  label={gettext("Назва курса")}
                  value={edCourse.name ? edCourse.name : edCourse.course}
                  handleChange={(e) => {this._handleChange('course', e.target.value, i)}}
                  errors={errors['course_' + i] || errors[i] && errors[i].course}
                  handleFieldErrors={this.props.handleErrors}
                  validation={['required']}
                  inputRef={el => {
                    if (i == this.indexBlockFocus && el) {el.focus()}
                  }}
                />
                  {
                    !this.props.hideDate &&
                    <Select
                        value={edCourse.end_year}
                        label={gettext('Рік закінчення')}
                        placeholder={gettext('вкажіть рік')}
                        handleChange={(val) => {this._handleSelection('end_year', val, i)}}
                        options={this._generateYearOptions()}
                        className={s.halfInput}
                        errors={errors[i] && errors[i].end_year}
                    />
                  }
                <a
                    className='formlink'
                    onClick={e => this._removeCourse(i)}
                >
                  <i className='icon-cancel'/> {gettext('Видалити')}
                </a>
              </div>
            )
          })
        }
        <LayerOpener
            label={gettext("+ Додати курс")}
            handleClick={this._addCourse.bind(this)}
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from '../../forms/Select';
import MultiSelect from '../../forms/MultiSelect';
import TextArea from '../../forms/TextArea';
import FormFooter from '../../forms/FormFooter';
import { convertToOptionsList } from '../../../utils/convertors';
import {
    clearErrors
} from '../../../actions/commonActions';

import s from './ResumeEditSummaryBox.css';

class ResumeEditSummaryBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            experienceSpecialtyOptions: [],
            employmentTypesOptions: []
        }
    }

    componentWillMount(){
        this.setState({formData: {'about': this.props.data.about}});
        this.props.fetchExperienceSpecialty()
            .then(response => {
                if(!response.error) this.setState({experienceSpecialtyOptions: response.payload.data});
            });

        this.props.fetchEmploymentTypes()
            .then(response => {
                if(!response.error) this.setState({employmentTypesOptions: response.payload.data});
            })
    }

    componentWillUnmount() {
        this.props.clearErrors();
    }

    _handleTagCreate(e) {
        return {
            label: (e.label).trim(),
            value: {
                name: (e.label).trim()
            }
        }
    }

    _handleSkillsChange(val){
        const skills = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, skills}});
    }

    _handleCitiesChange(val){
        const cities = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, cities}});
    }

    _handleEmploymentTypesChange(val){
        const employment_type = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, employment_type}});
    }

    _handleSkillInputChange(query) {
        return this.props.fetchSkills(query.trim())
            .then(response => {
                if(!response.error)
                    return {options: response.payload.data}
            })
    }

    _handleCityInputChange(query) {
        return this.props.fetchCities(query)
            .then(response => {
                if(!response.error)
                    return {options: response.payload.data};
            })
    }

    _isValidNewOption(newOption) {
      return newOption.label && (newOption.label).trim().length != 0
    }

    render(){
        const { formData } = this.state;
        const { errors, data } = this.props;
        return (
            <div className={s.resumeEditSummaryBox}>
                <Select
                    className="halfrow"
                    label={gettext("Досвiд роботи по спецiальностi")}
                    value={typeof formData.experience_specialty === 'undefined' ? {label: data.experience_specialty ? data.experience_specialty.name : '', value: data.experience_specialty ? data.experience_specialty.id : null} : formData.experience_specialty || ''}
                    handleChange={(val) => {this.setState({formData: {...formData, experience_specialty: val} })}}
                    options={this.state.experienceSpecialtyOptions}
                    errors={errors.experience_specialty}
                />
                <MultiSelect
                    label={gettext("Переваги та компетенції")}
                    value={convertToOptionsList(typeof formData.skills === 'undefined' ? data.skills : formData.skills)}
                    handleChange={this._handleSkillsChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    loadOptions={this._handleSkillInputChange.bind(this)}
                    isValidNewOption={this._isValidNewOption.bind(this)}
                    creatable
                    async
                />
                <MultiSelect
                    label={gettext("Хочу працювати в")}
                    value={convertToOptionsList(typeof formData.cities === 'undefined' ? data.cities : formData.cities)}
                    handleChange={this._handleCitiesChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    loadOptions={this._handleCityInputChange.bind(this)}
                    async
                />
                <MultiSelect
                    label={gettext("Вид зайнятостi")}
                    options={this.state.employmentTypesOptions}
                    value={convertToOptionsList(typeof formData.employment_type === 'undefined' ? data.employment_type : formData.employment_type)}
                    handleChange={this._handleEmploymentTypesChange.bind(this)}
                />
                <TextArea
                    name='about'
                    label={gettext("Коротко про себе")}
                    value={typeof formData.about === 'undefined' ? data.about || '' : formData.about || ''}
                    handleChange={(e) => {this.setState({formData: {...formData, about: e.target.value} })}}
                    errors={errors.about}
                    handleFieldErrors={this.props.handleErrors}
                    validation={['required']}
                />
                <FormFooter
                    handleCancel={this.props.handleClose}
                    handleSubmit={e => {this.props.handleSubmit('summary', formData)}}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearErrors
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(ResumeEditSummaryBox);

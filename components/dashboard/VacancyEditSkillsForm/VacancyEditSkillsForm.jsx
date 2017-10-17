import React, { Component } from 'react';
import Select from '../../forms/Select';
import MultiSelect from '../../forms/MultiSelect';
import FormFooter from '../../forms/FormFooter';
import { convertToOptionsList } from '../../../utils/convertors';

import s from './VacancyEditSkillsForm.css';

export default class VacancyEditSkillsForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            formData: {},
            educationLevelsOptions: [],
            experienceSpecialtyOptions: [],
            mustSkills: null,
            otherSkills: null
        };
    }

    componentWillMount(){
        this.setState({
            formData: {
                education_levels: this.props.data.education_levels,
                experience_specialty: this.props.data.experience_specialty
            },
            mustSkills: this.props.data.skills.filter(s => {return s.is_must}),
            otherSkills: this.props.data.skills.filter(s => {return !s.is_must})
        });
        this.props.fetchExperienceSpecialtyOptions()
            .then(response => {
                if(!response.error) this.setState({experienceSpecialtyOptions: response.payload.data});
            });

        this.props.fetchEducationLevelsOptions()
            .then(response => {
                if(!response.error) this.setState({educationLevelsOptions: response.payload.data});
            })
    }

    _handleEducationLevelsChange(val) {
        const education_levels = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, education_levels}});
    }

    _handleTagCreate(e) {
        return {
            label: e.label,
            value: {
                name: e.label
            },
        }
    }

    _fetchSkillsOptions(val){
        return this.props.fetchSkillsOptions(val)
            .then(response => {
                if(!response.error)
                    return {options: response.payload.data};
            })
    }

    _handleMustSkillsChange(val){
        const mustSkills = convertToOptionsList(val, true);
        this.setState({mustSkills});
    }

    _handleOtherSkillsChange(val){
        const otherSkills = convertToOptionsList(val, true);
        this.setState({otherSkills});
    }

    _handleSubmit(){
        const {formData, mustSkills, otherSkills} = this.state;
        let skills = [];
        if(mustSkills)
            mustSkills.map(s => {
                s.is_must = true;
                skills.push(s);
            });
        if(otherSkills)
            otherSkills.map(s => {
                s.is_must = false;
                skills.push(s);
            });
        formData.skills = skills;
        this.props.handleSubmit('skills', formData);
    }

    _isValidNewOption(newOption){
      return newOption.label && (newOption.label).trim().length != 0
    }

    render(){
        const { formData } = this.state;
        const { data, errors } = this.props;
        return (
            <div>
                <MultiSelect
                    label={gettext("Рiвень освiти")}
                    options={this.state.educationLevelsOptions}
                    value={convertToOptionsList(formData.education_levels)}
                    handleChange={this._handleEducationLevelsChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    isValidNewOption={this._isValidNewOption.bind(this)}
                    creatable
                />
                <Select
                    label={gettext("Досвiд роботи")}
                    value={formData.experience_specialty.length && formData.experience_specialty[0].experience_specialty}
                    handleChange={(val) => { this.setState({formData: {...formData, experience_specialty: [{name: val.label, experience_specialty: val.value}]} })}}
                    options={this.state.experienceSpecialtyOptions}
                    errors={errors.experience_specialty}
                />
                <MultiSelect
                    label={gettext("Ключові компетенції")}
                    value={convertToOptionsList(this.state.mustSkills)}
                    handleChange={this._handleMustSkillsChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    loadOptions={this._fetchSkillsOptions.bind(this)}
                    isValidNewOption={this._isValidNewOption.bind(this)}
                    creatable
                    async
                />
                <MultiSelect
                    label={gettext("Бажані компетенції")}
                    value={convertToOptionsList(this.state.otherSkills)}
                    handleChange={this._handleOtherSkillsChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    loadOptions={this._fetchSkillsOptions.bind(this)}
                    isValidNewOption={this._isValidNewOption.bind(this)}
                    creatable
                    async
                />
                <FormFooter
                    handleCancel={this.props.handleCancel}
                    handleSubmit={this._handleSubmit.bind(this)}
                />
            </div>
        );
    }
}
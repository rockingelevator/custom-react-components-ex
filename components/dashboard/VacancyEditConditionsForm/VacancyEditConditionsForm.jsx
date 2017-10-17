import React, { Component } from 'react';
import FormFooter from '../../forms/FormFooter';
import MultiSelect from '../../forms/MultiSelect';
import TextArea from '../../forms/TextArea';
import { convertToOptionsList } from '../../../utils/convertors';

export default class VacancyEditConditionsForm extends Component {
    constructor(props){
        super(props);
        this.state={
            formData: {},
            employmentTypeOptions: [],
            timeScheduleOptions: [],
        };
    }

    componentWillMount(){
        this.props.fetchEmploymentTypeOptions()
            .then(response => {
                if(!response.error) this.setState({employmentTypeOptions: response.payload.data});
            });
        this.props.fetchTimeScheduleOptions()
            .then(response => {
                if(!response.error) this.setState({timeScheduleOptions: response.payload.data});
            });
    }

    _handleEmploymentTypeChange(val){
        const employment_type = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, employment_type}});
    }

    _handleTimeScheduleChange(val){
        const time_schedules = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, time_schedules}});
    }

    _handleAdvantagesChange(val){
        const advantages = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, advantages}});
    }

    _fetchAdvantageOptions(val) {
        return this.props.fetchAdvantageOptions(val)
            .then(response => {
                if(!response.error)
                    return {options: response.payload.data};
            })
    }

    _handleTagCreate(e) {
        return {
            label: e.label,
            value: {
                name: e.label
            },
            name: e.label // api fix, should to remap all values to meet post requirements
        }
    }

    _isValidNewOption(newOption){
      return newOption.label && (newOption.label).trim().length != 0
    }

    render(){
        const {formData} = this.state;
        const {data, errors} = this.props;
        return (
            <div>
                <MultiSelect
                    label={gettext("Вид зайнятостi")}
                    options={this.state.employmentTypeOptions}
                    value={convertToOptionsList(typeof formData.employment_type === 'undefined' ? data.employment_type : formData.employment_type)}
                    handleChange={this._handleEmploymentTypeChange.bind(this)}
                />
                <MultiSelect
                    label={gettext("Графiк")}
                    options={this.state.timeScheduleOptions}
                    value={convertToOptionsList(typeof formData.time_schedules === 'undefined' ? data.time_schedules : formData.time_schedules)}
                    handleChange={this._handleTimeScheduleChange.bind(this)}
                />
                <TextArea
                    label={gettext("Умови")}
                    value={typeof formData.working_conditions === 'undefined' ? data.working_conditions : formData.working_conditions || ''}
                    handleChange={(e) => {
                        this.setState({formData: {...formData, working_conditions: e.target.value}})
                    }}
                    errors={errors.working_conditions}
                />
                <MultiSelect
                    label={gettext("Переваги")}
                    value={convertToOptionsList(typeof formData.advantages === 'undefined' ? data.advantages : formData.advantages)}
                    handleChange={this._handleAdvantagesChange.bind(this)}
                    newOptionCreator={this._handleTagCreate.bind(this)}
                    loadOptions={this._fetchAdvantageOptions.bind(this)}
                    isValidNewOption={this._isValidNewOption.bind(this)}
                    creatable
                    async
                />
                <FormFooter
                    handleCancel={this.props.handleCancel}
                    handleSubmit={e => {
                        this.props.handleSubmit('conditions', formData)
                    }}
                />
            </div>
        );
    }
}
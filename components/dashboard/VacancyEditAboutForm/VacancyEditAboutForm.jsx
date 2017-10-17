import React, { Component } from 'react';
import TextArea from '../../forms/TextArea';
import FormFooter from '../../forms/FormFooter';

import s from './VacancyEditAboutForm.css';

export default class VacancyEditAboutForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
        }
    }

    componentWillMount(){
        this.setState({
            formData: {
                about: this.props.data.about,
                description: this.props.data.description,
                about_company: this.props.data.about_company
            }
        })
    }

    render() {
        const { formData } = this.state;
        const { data, errors } = this.props;
        return (
            <div>
                <TextArea
                    name='about'
                    label={gettext("Опис вакансії")}
                    value={formData.about}
                    handleChange={(e) => {
                        this.setState({formData: {...formData, about: e.target.value}})
                    }}
                    errors={errors.about}
                    validation={['required']}
                    handleFieldErrors={this.props.handleErrors}
                />
                <TextArea
                    label={gettext("Обов'язки")}
                    value={formData.description}
                    handleChange={(e) => {
                        this.setState({formData: {...formData, description: e.target.value}})
                    }}
                    errors={errors.description}
                />
                <TextArea
                    label={gettext("Про компанію")}
                    value={formData.about_company}
                    handleChange={(e) => {
                        this.setState({formData: {...formData, about_company: e.target.value}})
                    }}
                    errors={errors.about_company}
                />
                <FormFooter
                    handleCancel={this.props.handleClose}
                    handleSubmit={e => {
                        this.props.handleSubmit('about', formData)
                    }}
                />
            </div>
        );
    }
}

import React, { Component } from 'react';
import AvatarDrop from '../../forms/AvatarDrop';
import TextInput from '../../forms/TextInput';
import Select from '../../forms/Select';
import FormFooter from '../../forms/FormFooter';
import MultiSelect from '../../forms/MultiSelect';
import { CURRENCY_OPTIONS, max_upload_file_size } from '../../../constants';
import { convertToOptionsList } from '../../../utils/convertors';
import { setAddressComponents } from '../../../utils/utils';

import s from '../ResumeEditTitleBox/ResumeEditTitleBox.css';

export default class VacancyEditTitleBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            uploadingPhoto: false
        };
        this.autocomplete = null;
        this.selectedAddress = '';
        this.addressComponents = {
            country: '',
            area: '',
            city: '',
            street: '',
            geo_point: ''
        };
        this._fetchScopeActivityOptions = this._fetchScopeActivityOptions.bind(this);
    }

    componentWillMount(){
        const { data } = this.props;
        this.setState({
            formData: {
                header: data.header,
                name_company: data.name_company,
                scope_activity: data.scope_activity,
                address: data.address,
                salary: data.salary,
                currency: data.currency,
            }
        });
        this.selectedAddress = data.address;
        this.addressComponents.country = data.country;
        this.addressComponents.area = data.area;
        this.addressComponents.city = data.city;
        this.addressComponents.street = data.street;
        this.addressComponents.geo_point = data.geo_point;
    }

    componentDidMount() {
        this.inputElementFocus && this.inputElementFocus.focus();
        this.initAutocomplete()
    }

    initAutocomplete() {
        this.autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('suggest-address')),
            {types: ['geocode']}
        );
        this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
    }

    fillInAddress() {
        let place = this.autocomplete.getPlace();
        const { formData } = this.state;
        if (place.formatted_address) {
            this.setState({formData: {...formData, address: place.formatted_address}});
            this.selectedAddress = place.formatted_address;
            setAddressComponents(place, this.addressComponents);
        }
    }

    _handleScopeActivityChange(val) {
        const scope_activity = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, scope_activity}});
    }

    _handleScopeActivityCreate(e) {
        return {
            label: e.label,
            value: {
                name: e.label
            }
        }
    }

    _handleSubmit(){
        const { formData } = this.state;
        let data = {...formData};

        if (formData.address && formData.address == this.selectedAddress) {
            data.country = this.addressComponents.country;
            data.area = this.addressComponents.area;
            data.city = this.addressComponents.city;
            data.street = this.addressComponents.street;
            data.geo_point = this.addressComponents.geo_point;
        } else if (formData.address && formData.address != this.selectedAddress) {
            this.props.handleErrors({'address': [gettext('Виберіть адресу із запропонованих варіантів')]});
            return
        }
        this.props.handleSubmit('titleBox', data);
    }

    componentWillReceiveProps(newProps) {
        this.setState({uploadingPhoto: false});
    }

    _handleAvaDrop(files){
        const file = files[0];
        const data = new FormData();
        if (file && file.size > max_upload_file_size ) {
            this.setState({errors : { photo: [gettext('Розмір файла завеликий, максимальний розмір 1Mb')] }})
        } else {
            data.append("logo", file);
            this.setState({uploadingLogo: true, errors: {}}, () => {
                this.props.handleSubmit('logo', data);
            });
        }
    }

    _fetchScopeActivityOptions(query) {
        return this.props.fetchScopeActivityOptions(query.trim())
            .then(response => {
                if(!response.error){
                    return {options: response.payload.data};
                }
            })
    }

    _isValidNewOption(newOption) {
      return newOption.label && (newOption.label).trim().length != 0
    }

    render(){
        const { formData } = this.state;
        const { errors, data } = this.props;
        return (
            <div className={s.resumeEditTitleBox}>
                <div className={s.resumeEditTitleBox__avatar}>
                    <AvatarDrop
                        img={data.logo_company}
                        uploading={this.state.uploadingPhoto}
                        handleDrop={this._handleAvaDrop.bind(this)}
                        errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
                    />
                </div>
                <div className={s.resumeEditTitleBox__form}>
                    <TextInput
                        name='header'
                        label={gettext("Назва вакансії")}
                        value={formData.header}
                        handleChange={(e) => {this.setState({formData: {...formData, header: e.target.value} })}}
                        errors={errors.header}
                        handleFieldErrors={this.props.handleErrors}
                        validation={['required']}
                        inputRef={el => this.inputElementFocus = el}
                    />
                    <TextInput
                        name='name_company'
                        label={gettext("Назва компанії")}
                        value={formData.name_company}
                        handleChange={(e) => {this.setState({formData: {...formData, name_company: e.target.value} })}}
                        errors={errors.name_company}
                        handleFieldErrors={this.props.handleErrors}
                        validation={['required']}
                    />
                    <MultiSelect
                        label={gettext("Види діяльності")}
                        value={convertToOptionsList(formData.scope_activity)}
                        handleChange={this._handleScopeActivityChange.bind(this)}
                        newOptionCreator={this._handleScopeActivityCreate.bind(this)}
                        loadOptions={this._fetchScopeActivityOptions.bind(this)}
                        isValidNewOption={this._isValidNewOption.bind(this)}
                        creatable
                        async
                    />
                    <TextInput
                        name='address'
                        id="suggest-address"
                        label={gettext("Адреса")}
                        value={formData.address}
                        handleChange={(e) => {this.setState({formData: {...formData, address: e.target.value} })}}
                        handleEnterPressed={(e) => {this.setState({formData: {...formData, address: e.target.value} })}}
                        errors={errors.address}
                        handleFieldErrors={this.props.handleErrors}
                        validation={['required']}
                    />
                    <div className="formrow">
                        <TextInput
                            name="salary"
                            label={gettext("Сума винагороди")}
                            className="halfrow"
                            value={formData.salary}
                            handleChange={(e) => { this.setState({formData: {...formData, salary: (e.target.value && e.target.value.replace(/\s/g,'') || null)} })}}
                            errors={errors.salary}
                            handleFieldErrors={this.props.handleErrors}
                            validation={['required', 'onlyNumbers']}
                        />
                        <Select
                            label={gettext("Валюта")}
                            className="halfrow"
                            value={formData.currency}
                            handleChange={(val) => { this.setState({formData: {...formData, currency: val.value} })}}
                            errors={errors.currency}
                            options={CURRENCY_OPTIONS}
                        />
                    </div>

                    <FormFooter
                        handleCancel={this.props.handleClose}
                        handleSubmit={this._handleSubmit.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

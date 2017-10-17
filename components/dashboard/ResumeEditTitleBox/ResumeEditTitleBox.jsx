import React, { Component } from 'react';
import AvatarDrop from '../../forms/AvatarDrop';
import TextInput from '../../forms/TextInput';
import Select from '../../forms/Select';
import FormFooter from '../../forms/FormFooter';
import DayMonthYearRow from '../../forms/DayMonthYearRow';
import MultiSelect from '../../forms/MultiSelect';
import { CURRENCY_OPTIONS, max_upload_file_size } from '../../../constants';
import { convertToOptionsList } from '../../../utils/convertors';
import { setAddressComponents } from '../../../utils/utils';

import s from './ResumeEditTitleBox.css';

export default class ResumeEditTitleBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bDay: null,
            bMonth: null,
            bYear: null,
            formData: {},
            positionOptions: [],
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
        this._fetchPositionOptions = this._fetchPositionOptions.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({uploadingPhoto: false});
    }

    componentWillMount(){
        const { data } = this.props;
        let year = null;
        let month = null;
        let day = null;
        if (data.jobseeker_birthday) {
            let birthday = new Date(data.jobseeker_birthday);
            year = birthday.getFullYear();
            month = birthday.getMonth();
            day = birthday.getDate();
        }
        this.setState({
            bYear: year,
            bMonth: month,
            bDay: day,
            formData: data
        });
        this.selectedAddress = data.jobseeker_address;
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
            this.setState({formData: {...formData, jobseeker_address: place.formatted_address}});
            this.selectedAddress = place.formatted_address;
            setAddressComponents(place, this.addressComponents);
        }
    }

    _handlePositionsChange(val) {
        const positions = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, positions}});
    }

    _handleSubmit(){
        const {
            formData,
            bDay,
            bMonth,
            bYear
        } = this.state;
        const { handleSubmit } = this.props;
        let d = formData || {};
        const birthday = bYear && (bMonth >= 0) && bDay ? `${bYear}-${bMonth+1}-${bDay}` : null;
        if(birthday)
            d.jobseeker_birthday = birthday;

        if (formData.jobseeker_address && formData.jobseeker_address == this.selectedAddress) {
            d.country = this.addressComponents.country;
            d.area = this.addressComponents.area;
            d.city = this.addressComponents.city;
            d.street = this.addressComponents.street;
            d.geo_point = this.addressComponents.geo_point;
        } else if (formData.jobseeker_address && formData.jobseeker_address != this.selectedAddress) {
            this.props.handleErrors({'jobseeker_address': [gettext('Виберіть адресу із запропонованих варіантів')]});
            return
        }
        handleSubmit('titleBox', d);
    }

    _handleAvaDrop(files){
        const file = files[0];
        const data = new FormData();
        if (file && file.size > max_upload_file_size ) {
            this.setState({errors : { photo: [gettext('Розмір файла завеликий, максимальний розмір 1Mb')] }})
        } else {
            data.append("photo", file);
            this.setState({uploadingUserpic: true, errors: {}});
            this.props.handleSubmit('photo', data);
        }
    }

    _fetchPositionOptions(query) {
        return this.props.fetchPositions(query.trim())
            .then(response => {
                if(!response.error)
                    return {options: response.payload.data}
            })
    }

    _handleTagCreate(e) {
        return {
            label: (e.label).trim(),
            value: {
                name: (e.label).trim()
            }
        }
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
                       img={data.jobseeker_photo}
                       uploading={this.state.uploadingPhoto}
                       handleDrop={this._handleAvaDrop.bind(this)}
                       errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
                   />
               </div>
               <div className={s.resumeEditTitleBox__form}>
                   <TextInput
                        name='jobseeker_name'
                        label={gettext("Iм'я")}
                        value={typeof formData.jobseeker_name === 'undefined' ? data.jobseeker_name : formData.jobseeker_name || ''}
                        handleChange={(e) => {this.setState({formData: {...formData, jobseeker_name: e.target.value} })}}
                        errors={errors.jobseeker_name}
                        validation={['required']}
                        handleFieldErrors={this.props.handleErrors}
                        inputRef={el => this.inputElementFocus = el}
                   />
                   <TextInput
                        name='header'
                       label={gettext("Назва резюме")}
                       value={typeof formData.header === 'undefined' ? data.header : formData.header || ''}
                       handleChange={(e) => {this.setState({formData: {...formData, header: e.target.value} })}}
                       errors={errors.header}
                       validation={['required']}
                       handleFieldErrors={this.props.handleErrors}
                   />
                   <MultiSelect
                       label={gettext("Посада, на якiй хочете працювати")}
                       options={this.state.positionOptions}
                       value={convertToOptionsList(typeof formData.positions === 'undefined' ? data.positions : formData.positions)}
                       handleChange={this._handlePositionsChange.bind(this)}
                       newOptionCreator={this._handleTagCreate.bind(this)}
                       loadOptions={this._fetchPositionOptions.bind(this)}
                       isValidNewOption={this._isValidNewOption.bind(this)}
                       creatable
                       async
                   />
                   <div className="formrow">
                       <TextInput
                           name="salary"
                           label={gettext("Сума винагородження")}
                           className="halfrow"
                           value={typeof formData.salary === 'undefined' ? data.salary : formData.salary || ''}
                           handleChange={(e) => {this.setState({formData: {...formData, salary: (e.target.value && e.target.value.replace(/\s/g,'') || null)} })}}
                           errors={errors.salary}
                           validation={['onlyNumbers']}
                           handleFieldErrors={this.props.handleErrors}
                       />
                       <Select
                           label={gettext("Валюта")}
                           className="halfrow"
                           value={typeof formData.currency === 'undefined' ? data.currency : formData.currency }
                           handleChange={(val) => { this.setState({formData: {...formData, currency: val.value} })}}
                           errors={errors.currency}
                           options={CURRENCY_OPTIONS}
                       />
                   </div>

                   <TextInput
                        name='jobseeker_address'
                       id="suggest-address"
                       label={gettext("Адреса")}
                       value={typeof formData.jobseeker_address === 'undefined' ? data.jobseeker_address : formData.jobseeker_address}
                       handleChange={(e) => {this.setState({formData: {...formData, jobseeker_address: e.target.value} })}}
                       handleEnterPressed={(e) => {this.setState({formData: {...formData, jobseeker_address: e.target.value} })}}
                       errors={errors.jobseeker_address}
                       validation={['required']}
                       handleFieldErrors={this.props.handleErrors}

                   />

                   <DayMonthYearRow
                       day={this.state.bDay}
                       month={this.state.bMonth}
                       year={this.state.bYear}
                       handleChange={(data) => { this.setState(data) }}
                       errors={errors.birthday}
                   />
                   <FormFooter
                       handleCancel={this.props.handleClose}
                       handleSubmit={this._handleSubmit.bind(this)}
                   />
               </div>
           </div>
       );
   }
}

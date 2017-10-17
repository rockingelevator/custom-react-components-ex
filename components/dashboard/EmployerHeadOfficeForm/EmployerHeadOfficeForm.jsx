import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import ReactTelInput from 'react-telephone-input'
import { setAddressComponents } from '../../../utils/utils';

import s from './EmployerHeadOfficeForm.css';

export default class EmployerHeadOfficeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headoffice: {},
        };
        this.selectedAddress = '';
        this.addressComponents = {
            country: '',
            area: '',
            city: '',
            street: '',
            geo_point: ''
        };
        this.autocomplete = null;
        this._handlePhoneChange = this._handlePhoneChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillMount(){
        this.props.handleFormInit(gettext('Головний офіс')); //pass form title to parent component
        this.setState({
            headoffice: {
            ...this.state.headoffice,
            phone: this.props.employer.phone,
            website: this.props.employer.website,
            address: this.props.employer.address
            }
        });
        this.selectedAddress = this.props.employer.address;
    }

    componentDidMount() {
        this.refs.inputElementFocus && this.refs.inputElementFocus.refs.instance.refs.numberInput.focus();
        this.initAutocomplete();
    }

    componentWillReceiveProps(newProps){
        if (newProps.employer && Object.keys(newProps.errors).length == 0 && !newProps.fetching) {
            this.setState({headoffice: {
                ...this.state.headoffice,
                phone: newProps.employer.phone,
                website: newProps.employer.website,
                address: newProps.employer.address
            }});
            this.selectedAddress = newProps.employer.address;
        }
    }

    _handleSubmit() {
        if (this.state.headoffice.address == this.selectedAddress) {
            let data = {
                phone: this.state.headoffice.phone,
                website: this.state.headoffice.website,
                address: this.state.headoffice.address,
                country: this.addressComponents.country,
                area: this.addressComponents.area,
                city: this.addressComponents.city,
                street: this.addressComponents.street,
                geo_point: this.addressComponents.geo_point,
            };
            this.props.handleSubmit('headoffice', data);
        } else if (this.state.headoffice.address) {
            this.props.handleErrors({'address': [gettext('Виберіть адресу із запропонованих варіантів')]})
        }
    }

    _handlePhoneChange(telNumber, selectedCountry) {
        if (!this.state.headoffice)
            return;
        telNumber = telNumber.substr(0,17);

        if (telNumber.length < 4) {
            this.setState({headoffice: {...this.state.headoffice, phone: '+380'}})
        } else {
            this.setState({headoffice: {...this.state.headoffice, phone: telNumber}})
        }
    }

    initAutocomplete() {
        this.autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('suggest-head-office-address')),
            {types: ['geocode']}
        );
        this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
    }

    fillInAddress() {
        let place = this.autocomplete.getPlace();
        const { headoffice } = this.state;
        if (place.formatted_address) {
            this.setState({headoffice: {...headoffice, address: place.formatted_address}});
            this.selectedAddress = place.formatted_address;
            setAddressComponents(place, this.addressComponents);
        }
    }

    render(){
        const { headoffice } = this.state;
        const { errors } = this.props;
        return (
            <div>
                <label className='inputLabel inputLabel_default'>{gettext("Контактний телефон")}</label>
                <ReactTelInput
                    defaultCountry="ua"
                    value={headoffice.phone}
                    onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
                    onChange={this._handlePhoneChange}
                    flagsImagePath="/static/img/flags.png"
                    classNames="reactTelephoneInput"
                    ref='inputElementFocus'
                />
                { errors.phone &&
                  <ul className={s.errorList}>
                    {errors.phone.map((error, i) => {
                      return (
                        <li key={"error-" + i}>{error}</li>
                      )})
                    }
                  </ul>
                }
                <TextInput
                    label={gettext("Адреса сайту")}
                    name="website"
                    value={headoffice.website}
                    handleChange={(e) => {this.setState({headoffice: {...headoffice, website: e.target.value} })}}
                    errors={errors.website}
                    validation={['url']}
                    handleFieldErrors={this.props.handleErrors}
                    placeholder='http://example.com'
                />
                <TextInput
                  id="suggest-head-office-address"
                  name='address'
                  label={gettext("Адреса")}
                  value={headoffice.address}
                  handleChange={(e) => {this.setState({headoffice: {...headoffice, address: e.target.value} })}}
                  errors={errors.address}
                  validation={['required']}
                  handleFieldErrors={this.props.handleErrors}
                />
                <FormFooter
                    handleSubmit={this._handleSubmit}
                    fetching={this.props.fetching}
                />
            </div>
        )
    }
}

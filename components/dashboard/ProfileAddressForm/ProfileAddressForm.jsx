import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import Button from '../../forms/Button';
import FormFooter from '../../forms/FormFooter';
import { setAddressComponents } from '../../../utils/utils';

import s from './ProfileAddressForm.css';

export default class ProfileAddressForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      address: null
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
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Адреса')); //pass form title to parent component
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
    this.initAutocomplete()
  }

  componentWillReceiveProps(newProps) {
    if (this.state.address === null && newProps.user && newProps.user.address) {
      this.setState({address: newProps.user.address});
      this.selectedAddress = newProps.user.address;
      this.addressComponents.country = newProps.user.country;
      this.addressComponents.area = newProps.user.area;
      this.addressComponents.city = newProps.user.city;
      this.addressComponents.street = newProps.user.street;
      this.addressComponents.geo_point = newProps.user.geo_point;
    }
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('suggest-profile-address')),
      {types: ['geocode']}
    );
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  fillInAddress() {
    let place = this.autocomplete.getPlace();
    if (place.formatted_address) {
      this.setState({address: place.formatted_address});
      this.selectedAddress = place.formatted_address;
      setAddressComponents(place, this.addressComponents);
    }
  }

  _handleSubmit() {
    if (this.state.address == this.selectedAddress) {
      let data = {
        address: this.state.address,
        country: this.addressComponents.country,
        area: this.addressComponents.area,
        city: this.addressComponents.city,
        street: this.addressComponents.street,
        geo_point: this.addressComponents.geo_point,
      };
      this.props.handleSubmit('address', data);
    } else if (this.state.address) {
      this.props.handleErrors({'address': [gettext('Виберіть адресу із запропонованих варіантів')]})
    }
  }

  render() {
    return (
      <div>
        <TextInput
          name='address'
          id="suggest-profile-address"
          label={gettext("Мiсце проживання")}
          value={this.state.address}
          handleChange={(e) => { this.setState({address: e.target.value}) }}
          errors={this.props.errors.address}
          validation={['required']}
          handleFieldErrors={this.props.handleErrors}
          inputRef={el => this.inputElementFocus = el}
        />
        <FormFooter
          handleSubmit={this._handleSubmit}
          fetching={this.props.fetching}
        />
      </div>
    );
  }
}

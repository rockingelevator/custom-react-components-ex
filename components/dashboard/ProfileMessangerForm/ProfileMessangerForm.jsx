import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import ReactTelInput from 'react-telephone-input';
import s from './ProfileMessangerForm.css';

export default class ProfileAddressForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      user: {},
    };
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Месенджери')); //pass form title to parent component
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  componentWillReceiveProps(newProps) {
    if(Object.keys(this.state.user).length != 5 && newProps.user && newProps.user.skype !== undefined) {
      this.setState({user:
        {
          skype: newProps.user.skype,
          viber: newProps.user.viber ? newProps.user.viber : '+380',
          telegram: newProps.user.telegram ? newProps.user.telegram : '+380',
          snapchat: newProps.user.snapchat ? newProps.user.snapchat : '+380',
          whats_app: newProps.user.whats_app ? newProps.user.whats_app : '+380'
        }});
    }
  }

  _handleSubmit() {
    const { user } = this.state;
    let skype = typeof user.skype === 'undefined' ? this.props.user.skype : user.skype;
    let viber = typeof user.viber === 'undefined' ? this.props.user.viber : user.viber != '+380' ? user.viber : null;
    let telegram = typeof user.telegram === 'undefined' ? this.props.user.telegram : user.telegram != '+380' ? user.telegram : null;
    let snapchat = typeof user.snapchat === 'undefined' ? this.props.user.snapchat : user.snapchat != '+380' ? user.snapchat : null;
    let whats_app = typeof user.whats_app === 'undefined' ? this.props.user.whats_app : user.whats_app != '+380' ? user.whats_app : null;
    let data = {
      skype: (skype && (skype).trim()),
      viber: viber,
      telegram: telegram,
      snapchat: snapchat,
      whats_app: whats_app,
    };
    this.props.handleSubmit('messangers', data)
  }

  _handleViberChange = (telNumber, selectedCountry) => {
    this._handlePhoneChange(telNumber, selectedCountry, 'viber')
  };

  _handleTelegramChange = (telNumber, selectedCountry) => {
    this._handlePhoneChange(telNumber, selectedCountry, 'telegram')
  };

  _handleSnapchatChange = (telNumber, selectedCountry) => {
    this._handlePhoneChange(telNumber, selectedCountry, 'snapchat')
  };

  _handleWhatsAppChange = (telNumber, selectedCountry) => {
    this._handlePhoneChange(telNumber, selectedCountry, 'whats_app')
  };

  _handlePhoneChange(telNumber, selectedCountry, type) {
    telNumber = telNumber.substr(0,17);
    let phone = telNumber.length < 4 ? phone = '+380' : telNumber;

    switch(type){
      case 'viber':
        this.setState({user: {...this.state.user, viber: phone}});
        break;
      case 'telegram':
        this.setState({user: {...this.state.user, telegram: phone}});
        break;
      case 'snapchat':
        this.setState({user: {...this.state.user, snapchat: phone}});
        break;
      case 'whats_app':
        this.setState({user: {...this.state.user, whats_app: phone}});
        break;
    }
  }

  render() {
    const { user } = this.state;
    const { errors } = this.props;
    return (
      <div>
        <TextInput
          label={gettext("Skype")}
          value={typeof user.skype === 'undefined' ? this.props.user.skype : user.skype}
          handleChange={(e) => {this.setState({user: {...user, skype: e.target.value} })}}
          placeholder={gettext("додайте назву вашого профілю")}
          errors={errors.skype}
          inputRef={el => this.inputElementFocus = el}
        />
        <label className='inputLabel inputLabel_default'>{gettext("Viber")}</label>
        <ReactTelInput
          defaultCountry="ua"
          value={typeof user.viber === 'undefined' ? this.props.user.viber : user.viber}
          onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
          onChange={this._handleViberChange}
          flagsImagePath="/static/img/flags.png"
          classNames="reactTelephoneInput"
        />
        {errors.viber &&
          <ul className={s.errorList}>
            {errors.viber.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }
        <label className='inputLabel inputLabel_default'>{gettext("Telegram")}</label>
        <ReactTelInput
          defaultCountry="ua"
          value={typeof user.telegram === 'undefined' ? this.props.user.telegram : user.telegram}
          onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
          onChange={this._handleTelegramChange}
          flagsImagePath="/static/img/flags.png"
          classNames="reactTelephoneInput"
        />
        {errors.telegram &&
          <ul className={s.errorList}>
            {errors.telegram.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }
        <label className='inputLabel inputLabel_default'>{gettext("Snapchat")}</label>
        <ReactTelInput
          defaultCountry="ua"
          value={typeof user.snapchat === 'undefined' ? this.props.user.snapchat : user.snapchat}
          onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
          onChange={this._handleSnapchatChange}
          flagsImagePath="/static/img/flags.png"
          classNames="reactTelephoneInput"
        />
        {errors.snapchat &&
          <ul className={s.errorList}>
            {errors.snapchat.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }
        <label className='inputLabel inputLabel_default'>{gettext("WhatsApp")}</label>
        <ReactTelInput
          defaultCountry="ua"
          value={typeof user.whats_app === 'undefined' ? this.props.user.whats_app : user.whats_app}
          onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
          onChange={this._handleWhatsAppChange}
          flagsImagePath="/static/img/flags.png"
          classNames="reactTelephoneInput"
        />
        {errors.whats_app &&
          <ul className={s.errorList}>
            {errors.whats_app.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }
        <FormFooter
          handleSubmit={this._handleSubmit}
          fetching={this.props.fetching}
        />
      </div>
    );
  }
}

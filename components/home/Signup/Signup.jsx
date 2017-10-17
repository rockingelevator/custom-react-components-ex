import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RadioGroup, RadioButton } from 'react-custom-radio';
import cs from '../../../css/common.css';
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';
import Cookie from "js-cookie";
import { registrationUser } from '../../../actions/userActions';
import FormStatus from '../../forms/FormStatus';
import ReactTelInput from 'react-telephone-input'

import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 'jobseeker',
      email: '',
      phone: '',
      password1: '',
      password2: '',
      errors: {},
      done_message: ''
    };
    Cookie.set('role_name', this.state.role);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleFieldErrors = this._handleFieldErrors.bind(this);
    this._handlePhoneChange = this._handlePhoneChange.bind(this);
  }

  componentWillMount(){
    this.setState({email: this.props.email})
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _handleSubmit() {
    let data = this.state;
    if (data.phone === '+380') {
      data.phone = '';
    }
    this.props.registrationUser(data)
      .then(response => {
        let data = response.payload.data;
        if (data.errors) {
          this.setState({errors: data.errors})
        } else if (data.status == 'ok') {
          this.setState({done_message: data.done_message})
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  _handleFieldErrors(f){
    let errors = this.state.errors;
    if(f.errors.length < 1 && typeof errors[f.field] != 'undefined') {
        delete errors[f.field];
    } else{
        errors[f.field] = f.errors;
    }
    this.setState({errors});
  }

  _handlePhoneChange(telNumber, selectedCountry) {
    telNumber = telNumber.substr(0,17);
    if (telNumber.length < 4) {
      this.setState({phone: '+380'})
    } else {
      this.setState({phone: telNumber})
    }
  }

  render() {
    const { errors } = this.state;
    if (this.state.done_message) {
      return (
        <div className={s.modalContent}>
          <h1 className={s.modalTitle}>{gettext('Зареєструватись')}</h1>
          <p className={s.modalFormLabel}>{this.state.done_message}</p>
        </div>
      )
    }
    // TODO move radio group to own component
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext('Зареєструватись')}</h1>
        <RadioGroup
          name="role"
          selectedValue={this.state.role}
          onChange={(role) => {
            Cookie.set('role_name', role);
            this.setState({role})
          }}
          className={s.radiogroup}
        >
          <RadioButton value="jobseeker" className={cs.radio}>
            {gettext('Я кандидат')}
          </RadioButton>
          <RadioButton value="employer" className={cs.radio}>
            {gettext('Я роботодавець')}
          </RadioButton>
        </RadioGroup>
        <p className={s.modalFormLabel}>{gettext('зареєструватись через соцiальнi профiлi')}</p>
        <Button
          label={gettext('Facebook')}
          icon="icon-facebook"
          className={s.socialButton}
          handleClick={() => {
            window.location.href = "/login/facebook/?next=" + window.location.pathname;
          }}
        />
        <Button
          label={gettext('VK')}
          icon="icon-vk"
          className={s.socialButton}
          handleClick={() => {
            window.location.href = "/login/vk-oauth2/?next=" + window.location.pathname;
          }}
        />
        <p className={s.modalFormLabel}>або</p>
        <TextInput
          label={gettext("Електронна пошта")}
          name='email'
          value={this.state.email}
          handleChange={(e) => {
            this.setState({email: e.target.value})
          }}
          errors={this.state.errors.email}
          validation={['email']}
          handleFieldErrors={this._handleFieldErrors}
          handleEnterPressed={this._handleSubmit}
          inputRef={el => this.inputElementFocus = el}
        />
        <label className='inputLabel inputLabel_default'>
          {gettext("Телефон")}
        </label>
        <ReactTelInput
          defaultCountry="ua"
          value={this.state.phone}
          onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
          onChange={this._handlePhoneChange}
          flagsImagePath="/static/img/flags.png"
          classNames="reactTelephoneInput"
          handleEnterPressed={this._handleSubmit}
        />
        { errors.phone &&
          <ul className={s.errorField}>
            {errors.phone.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }
        <TextInput
          label={gettext("Пароль")}
          type="password"
          value={this.state.password1}
          handleChange={(e) => {
            this.setState({password1: e.target.value})
          }}
          errors={this.state.errors.password1}
          handleEnterPressed={this._handleSubmit}
        />
        <TextInput
          label={gettext("Пароль ще раз")}
          type="password"
          value={this.state.password2}
          handleChange={(e) => {
            this.setState({password2: e.target.value})
          }}
          errors={this.state.errors.password2}
          handleEnterPressed={this._handleSubmit}
        />
        {this.state.errors.__all__ &&
          <FormStatus
            error
            message={this.state.errors.__all__}
          />
        }
        <Button
          label={gettext('Зареєструватись')}
          className={s.modalButton + ' ' + s.modalButton_full}
          handleClick={this._handleSubmit}
        />
        <Button
          label={gettext('Увiйти')}
          className={s.modalButton + ' ' + s.modalButton_outline}
          handleClick={(e) => this.props.onChangeModalType('login')}
        />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    registrationUser
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(Signup);

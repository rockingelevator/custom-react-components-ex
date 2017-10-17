import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Cookie from "js-cookie";
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';
import { loginUser } from '../../../actions/userActions';
import FormStatus from '../../forms/FormStatus';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      doesNotExist: false,
      errors: {}
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    Cookie.remove('role_name');
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.value.showModal &&
        nextProps.value.modalType === 'login' &&
        Object.keys(this.state.errors).length > 0) {
      this.setState({email: '', password: '', errors: {}});
    }
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _handleSubmit(){
    this.props.loginUser({...this.state})
    .then( response => {
      let data = response.payload.data;
      if (data.errors) {
        this.setState({
          errors: data.errors,
          doesNotExist: data.does_not_exist
        })
      } else if (data.status == 'ok') {
        window.location.reload();
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  _handleFieldErrors(f){
    let errors = this.state.errors;
    if(f.errors.length < 1) {
        if(typeof errors[f.field] != 'undefined')
          delete errors[f.field];
    } else{
        errors[f.field] = f.errors;
    }
    this.setState({errors});
  }

  render(){
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>Увiйти</h1>
        <p className={s.modalFormLabel}>{gettext('через соцiальнi профiлi')}</p>
        <Button
          label={gettext('Facebook')}
          icon="icon-facebook"
          className={s.socialButton}
          handleClick={() => {window.location.href="/login/facebook/?next=" + window.location.pathname;}}
        />
        <Button
          label={gettext('VK')}
          icon="icon-vk"
          className={s.socialButton}
          handleClick={() => {window.location.href="/login/vk-oauth2/?next=" + window.location.pathname;}}
        />
        <p className={s.modalFormLabel}>або</p>
        <TextInput
          name='email'
          label={gettext("Електронна пошта")}
          value={this.state.email}
          handleChange={(e) => {this.setState({email: e.target.value})}}
          errors={this.state.errors.email}
          handleEnterPressed={this._handleSubmit}
          handleFieldErrors={this._handleFieldErrors.bind(this)}
          validation={['email']}
          inputRef={el => this.inputElementFocus = el}
        />
        <TextInput
            label={gettext("Пароль")}
            type="password"
            value={this.state.password}
            handleChange={(e) => {this.setState({password: e.target.value})}}
            errors={this.state.errors.password}
            handleEnterPressed={this._handleSubmit}
        />
        {this.state.errors.__all__ &&
          <FormStatus
            error
            message={this.state.errors.__all__}
          />
        }
        <Button
          label={gettext('Увiйти')}
          className={s.modalButton + ' ' + s.modalButton_full}
          handleClick={this._handleSubmit}
        />
        <Button
          label={gettext('Зареєструватись')}
          className={s.modalButton + ' ' + s.modalButton_outline}
          handleClick={(e) => {
            let email = this.state.doesNotExist ? this.state.email : null;
            this.props.onChangeModalType('signup', email)}
          }
        />
        <p>
          <a className='textLink' onClick={(e) => this.props.onChangeModalType('reset')}>
            {gettext('Нагадади пароль')}
          </a>
        </p>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginUser
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(Login);

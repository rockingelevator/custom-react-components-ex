import React, { Component } from 'react';
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';
import { emailValidation } from '../../../utils/validation';


export default class RequireEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleFieldErrors = this._handleFieldErrors.bind(this);
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
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

  _handleSubmit(e) {
    if (!this.state.email) {
      e.preventDefault();
      this.setState({errors: {email: [gettext("Це поле обов'язкове.")]}});
    } else if (this.state.errors.email.length) {
      e.preventDefault();
    }
  }

  render(){
    let url = '/complete/' + this.props.backend + '/';
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext("Обов'язкове поле")}</h1>
        <form action={url} method="post" onSubmit={this._handleSubmit}>
          <TextInput
            label={gettext("Електронна пошта")}
            name="email"
            value={this.state.email}
            handleChange={(e) => {this.setState({email: e.target.value})}}
            validation={['email']}
            errors={this.state.errors.email}
            handleFieldErrors={this._handleFieldErrors}
            inputRef={el => this.inputElementFocus = el}
          />
          <Button
            type="submit"
            label={gettext('Далi')}
            className={s.modalButton + ' ' + s.modalButton_full}
          />
        </form>
      </div>
    );
  }
}

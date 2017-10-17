import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';
import { passwordReset } from '../../../actions/userActions';


class ResetPwdForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
      done_message: ''
    };
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _handleSubmit() {
    this.props.passwordReset({...this.state})
      .then(response => {
        let data = response.payload.data;
        if (data.errors) {
          this.setState({errors: data.errors})
        } else {
          this.setState({done_message: data.done_message})
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  render(){
    if (this.state.done_message) {
      return (
        <div className={s.modalContent}>
          <h1 className={s.modalTitle}>{gettext('Нагадати пароль')}</h1>
          <p className={s.modalFormLabel}>{this.state.done_message}</p>
        </div>
      )
    }
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext('Нагадати пароль')}</h1>
        <TextInput
          label={gettext("Електронна пошта")}
          value={this.state.email}
          handleChange={(e) => {
            this.setState({email: e.target.value})
          }}
          errors={this.state.errors.email}
          inputRef={el => this.inputElementFocus = el}
        />
        <Button
          label={gettext('Далi')}
          className={s.modalButton + ' ' + s.modalButton_full}
          handleClick={this._handleSubmit}
        />
        <Button
          label={gettext('Повернутись')}
          className={s.modalButton + ' ' + s.modalButton_outline}
          handleClick={(e) => this.props.onChangeModalType('login')}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    passwordReset
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ResetPwdForm);

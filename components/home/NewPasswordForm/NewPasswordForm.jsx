import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';
import { newPasswordSave } from '../../../actions/userActions';


class NewPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_password1: '',
      new_password2: '',
      errors: {},
      done_message: ''
    };
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillUnmount(){
    history.pushState(null, null, '/');
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _handleSubmit() {
    this.props.newPasswordSave(this.props.uid, this.props.token, this.state)
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
          <h1 className={s.modalTitle}>{gettext('Перевстановлення паролю')}</h1>
          <p className={s.modalFormLabel}>{this.state.done_message}</p>
          <Button
            label={gettext('Увiйти')}
            className={s.modalButton + ' ' + s.modalButton_outline}
            handleClick={(e) => this.props.onChangeModalType('login')}
          />
        </div>
      )
    }
    if (!window.validlink) {
      return (
        <div className={s.modalContent}>
          <h1 className={s.modalTitle}>{gettext('Перевстановлення паролю')}</h1>
          <p className={s.modalFormLabel}>
            {gettext('Посилання на перевстановлення паролю було помилковим. Можливо тому, що воно було вже використано. Будь ласка, замовте нове перевстановлення паролю.')}
          </p>
          <p>
            <a className='textLink' onClick={(e) => this.props.onChangeModalType('reset')}>
              {gettext('Нагадади пароль')}
            </a>
          </p>
        </div>
      )
    }

    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext('Перевстановлення паролю')}</h1>
        <TextInput
          label={gettext("Пароль")}
          type="password"
          value={this.state.new_password1}
          handleChange={(e) => {
            this.setState({new_password1: e.target.value})
          }}
          errors={this.state.errors.new_password1}
          inputRef={el => this.inputElementFocus = el}
        />
        <TextInput
          label={gettext("Пароль ще раз")}
          type="password"
          value={this.state.new_password2}
          handleChange={(e) => {
            this.setState({new_password2: e.target.value})
          }}
          errors={this.state.errors.new_password2}
        />
        <Button
          label={gettext('Далi')}
          className={s.modalButton + ' ' + s.modalButton_full}
          handleClick={this._handleSubmit}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    newPasswordSave
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(NewPasswordForm);

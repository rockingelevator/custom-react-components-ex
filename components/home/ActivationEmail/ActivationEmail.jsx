import React, { Component } from 'react';
import s from '../../common/Modal/Modal.css';
import Button from '../../forms/Button';


export default class ActivationEmail extends Component {

  componentWillUnmount(){
    history.pushState(null, null, '/');
  }

  render(){
    if (window.validlink) {
      return (
        <div className={s.modalContent}>
          <p className={s.modalFormLabel}>
            {gettext('Ви активували аккаунт. Увійдіть в свій профіль.')}
          </p>
          <Button
            label={gettext('Увiйти')}
            className={s.modalButton + ' ' + s.modalButton_full}
            handleClick={(e) => this.props.onChangeModalType('login')}
          />
        </div>
      )
    }
    return (
      <div className={s.modalContent}>
        <p className={s.modalFormLabel}>
          Посилання не дійсне.
        </p>
      </div>
    )
  }
}

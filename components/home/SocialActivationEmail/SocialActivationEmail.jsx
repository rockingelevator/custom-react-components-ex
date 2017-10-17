import React, { Component } from 'react';
import s from '../../common/Modal/Modal.css';


export default class SocialActivationEmail extends Component {

  componentWillUnmount(){
    history.pushState(null, null, '/');
  }

  render(){
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext('Зареєструватись')}</h1>
        <p className={s.modalFormLabel}>
          {gettext('Вам було відправлено листа на пошту, щоб активувати аккаунт.')}
        </p>
      </div>
    )
  }
}

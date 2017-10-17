import React, { Component } from 'react';
import s from './Modal.css';

export default class Modal extends Component {

  render(){
    const {
      show,
      handleClose,
      children
    } = this.props;
    return (
      <div className={`${s.modalWrapper} ${show ? s.modalWrapper_show : s.modalWrapper_hide}`} onClick={handleClose}>
        <div
          className={`${s.modal} ${show ? s.modal_show : s.modal_hide}`}
          onClick={(e) => e.stopPropagation()}
        >
          { children }
          <a
            className={s.closeModalIcon}
            onClick={handleClose}
          >
            <i className="icon-cancel" />
          </a>
        </div>
      </div>
    );
  }
}

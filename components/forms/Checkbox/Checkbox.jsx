import React, { Component } from 'react';
import s from './Checkbox.css';

export default function(props) {
  return (
    <div
      className={`${s.checkboxWrapper} ${props.info ? s.withBubble : ''} ${props.isChecked ? s.checkboxWrapper__checked : ''} ${(props.className || '')}`}
      onClick={props.handleChange}
    >
        <div className={s.checkbox} />
        <i className={'icon-ok ' + s.checkboxIcon} />
        <label>{props.label}</label>
        <span className={s.infoBubble}>{props.info}</span>
    </div>
  );
}

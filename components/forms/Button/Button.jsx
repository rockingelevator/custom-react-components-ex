import React from 'react';
import s from './Button.css';

export default function (props) {
  return (
    <button
      className={`${s.button + ' ' + s.button_center} ${props.className || s.default_button} ${props.disabled ? s.disabledButton : ''}`}
      onClick={props.handleClick}
      type={props.type}
      disabled={props.disabled}
    >
    {props.icon &&
      <span className={props.label && s.buttonIcon}><i className={props.icon} />&nbsp;</span>
    }
      {props.label}
    </button>
  )
}

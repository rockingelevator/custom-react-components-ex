import React from 'react';
import { Link } from 'react-router-dom';
import s from './ServiceMessage.css';
import Button from '../../forms/Button';

export default function(props) {
  return (
    <div className={s.serviceMessage + ' ' +
      (props.message.show ? s.serviceMessage_show : s.serviceMessage_hide) + ' ' +
      (props.message.error ? s.serviceMessage_error : s.serviceMessage_success)
    }>
    <p>
      <span className={s.statusIcon}>
        {!props.message.error &&
          <i className='icon-thumbs-up' />
        }
        {props.message.error &&
          <i className='icon-cancel' />
        }
      </span>
      <span className={s.statusText}>
        {props.message.text}
      </span>
      <a className={s.closeMessage} onClick={props.handleClose}>
        <i className='icon-cancel' />
      </a>
      {props.message.goNext && props.message.buttonLabel &&
        <Link
          to={props.message.goNext || ''}
          className={'default_button_outline ' + s.serviceMessage__button}
        >
          {props.message.buttonLabel}
        </Link>
      }
    </p>
  </div>
  )
}

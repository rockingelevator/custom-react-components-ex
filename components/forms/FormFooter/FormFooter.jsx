import React from 'react';
import Button from '../Button';
import Spinner from '../../common/Spinner';

import s from './FormFooter.css';

export default function(props) {
  return (
    <div className={s.formFooter}>
      {
        props.handleCancel &&
        <Button
          label={props.cancelText || gettext('Назад')}
          className={`default_button_outline ${s.cancelButton}`}
          handleClick={props.handleCancel}
        />
      }
      <Spinner show={props.fetching}/>
      <Button
        type='submit'
        label={props.submitText || gettext('Зберегти')}
        className={`${props.fetching ? 'disabled_button' : 'default_button'} ${s.submitButton}`}
        handleClick={props.handleSubmit}
        disabled={props.fetching || props.submitDisabled}
        />
    </div>
  );
}

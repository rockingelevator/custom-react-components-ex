import React from 'react';

import s from './FormStatus.css';

export default function(props) {
  return (
    <div className={`${s.formStatus} ${props.error ? s.error : s.success}`}>
      <p>
        {props.error &&
          <i className='icon-cancel' />
        }
        { !props.error &&
          <i className='icon-thumbs-up' />
        }
        {props.message}
      </p>
    </div>
  );
}

import React from 'react';

import s from './Dropdown.css';

export default function(props) {
  return (
    <div className={s.dropdown + ' ' + (props.className ? props.className : '')}>
      <ul>
        {
          props.options && props.options.map((option, i) => {
            return (
              <li
                key={'option_' + i}
                onClick={e => props.handleOptionSelect(option)}
              >{option.label}</li>
            )
          })
        }
      </ul>
    </div>
  );
}

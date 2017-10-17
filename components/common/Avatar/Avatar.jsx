import React from 'react';
import s from './Avatar.css';

export default function(props) {
  //TODO img
  return (
    <div className={s.avatar + ' ' + (props.size == 'large' ? s.avatar_large : s.avatar_small) + ' ' + (props.className || '')}>
      {props.src &&
        <img src={props.src} />
      }
    </div>
  );
}

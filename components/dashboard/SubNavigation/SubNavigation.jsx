import React from 'react';
import s from './SubNavigation.css';

export default function(props) {
  return (
    <ul className={s.subnavigation}>
      { props.children }
    </ul>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import s from './SubNavigationItem.css';

export default function(props) {
  const path = props.path || '#';
  return (
    <li
      className={s.subnavigation__item}
    >
          <NavLink exact to={path} activeClassName={s.active} className={props.active ? 'active' : ''}>
              { props.label }
          </NavLink>
    </li>
  )
}

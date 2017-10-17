import React from 'react';
import { NavLink } from 'react-router-dom';

import s from './SubNavigationLink.css';

export default function (props) {
    return (
        <NavLink exact to={props.path} activeClassName={s.subNavigationLink_active} className={s.subNavigationLink}>
            { props.label }
            {
              props.rightControl &&
              <span className={s.subNavigationLink__rightControl}>
                { props.rightControl }
              </span>
            }
        </NavLink>
    )
}

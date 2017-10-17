import React from 'react';
import { Link } from 'react-router-dom';
import s from './Breadcrumbs.css';

const isFunc = function(val){
  return val instanceof Function;
}

export default function(props) {
  return (
    <ul className={s.breadcrumbs}>
      {
        props.items && props.items.map((item, i) => {
          return (
            <li key={'breadcrumb-' + i}>
              {
                isFunc(item.link) &&
                  <a onClick={console.log('its a function')}>{ gettext(item.label) }</a>
              }
              {
                !isFunc(item.link) &&
                  <Link to={ item.link }>
                    { gettext(item.label) }
                  </Link>
              }
            </li>
          )
        })
      }
    </ul>
  )
}

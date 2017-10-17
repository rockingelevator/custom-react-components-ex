import React from 'react';

import s from './CollapseSection.css';

export default function(props) {
    return (
        <div className={s.collapseSection}>
            <p>{props.label}</p>
            <span className={s.openIcon}>
                  {props.open &&
                  <i className="icon-angle-up" />
                  }
                  {!props.open &&
                  <i className="icon-angle-down" />
                  }
            </span>
        </div>
    )
}
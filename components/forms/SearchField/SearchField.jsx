import React from 'react';

import s from './SearchField.css';

export default function(props) {
    return (
        <div className={s.searchField}>
            <i className="icon-search" />
            <input
                onChange={props.handleChange}
                value={props.value}
                placeholder={props.placeholder}
            />
        </div>
    )
}
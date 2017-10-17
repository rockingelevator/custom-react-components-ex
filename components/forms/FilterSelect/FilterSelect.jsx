import React from 'react';
import Select from 'react-select';

import s from './FilterSelect.css';

export default function(props) {
    return (
        <div className={s.filterSelect}>
            <Select
                clearable={false}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
                options={ props.options }
            />
        </div>
    );
}
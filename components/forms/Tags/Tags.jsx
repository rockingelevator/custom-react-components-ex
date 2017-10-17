import React from 'react';

import s from './Tags.css';

export default function(props) {
    return (
        <ul className={s.tags + ' ' + (props.className || '')}>
            {props.tags && props.tags.map((tag, i) => {
                return (
                    <li key={'tag-' + i}>{tag}</li>
                );
            })}
        </ul>
    );
}
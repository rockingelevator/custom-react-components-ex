import React from 'react';

import s from './LayerOpener.css';

export default function(props) {
    return (
        <a
            className={s.layerOpener}
            onClick={props.handleClick}
        >
            { props.label }
        </a>
    );
}
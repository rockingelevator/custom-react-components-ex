import React from 'react';
import Switch from 'react-flexible-switch';

import s from './Switch.css';

export default function(props) {
    return (
        <div className={s.switchWrapper + ' ' + (props.className || '')}>
            <Switch
                value={props.value}
                onChange={props.handleChange}
                circleStyles={{
                    onColor: '#37A0F3',
                    offColor: '#cccccc',
                    diameter: 20
                }}
                switchStyles={{
                    width: 50
                }}
            />
            <label>
                {props.label}
            </label>
        </div>
    )
}
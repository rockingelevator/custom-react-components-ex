import React from 'react';
import { Circle } from 'rc-progress';

import s from './ResumeFillStats.css';

export default function(props) {
    return (
        <div className={s.resumeFillStats}>
            <p className={s.scoreLabel}>
                {props.score}
                <span className={s.small}>%</span>
            </p>
            <Circle
                percent={props.score}
                strokeWidth="5"
                strokeColor="#37A0F3"
                trailWidth="5"
                trailColor="#d3dfe5"
                className={s.resumeFillStatCircle}
            />
            <p className='sidePanel__text'>
                Заповніть розділ <strong>Професійній досвід</strong>, це підвіщить результативність пошуку роботи на 40%
            </p>
        </div>
    );
}
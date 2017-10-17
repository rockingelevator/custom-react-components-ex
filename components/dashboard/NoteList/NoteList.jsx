import React from 'react';

import s from './NoteList.css';

export default function(props) {
    return (
        <ul className={s.noteList}>
            {
                props.tips && props.tips.map((item, i) => {
                    return (
                        <li className={s.noteList__item} key={'tip-' + i}>
                            {item.tip}
                        </li>
                    )
                })
            }
        </ul>
    )
}
import React from 'react';
import s from './Banner.css';

export default function(props) {
  return (
    <div className={s.banner__wrapper}>
      <div
        className={s.banner__cover}
        style={{
          background: 'url(' + props.picture + ') center no-repeat',
          backgroundSize: 'cover'
        }}>
      </div>
      <div className={s.banner__content}>
        <h1 className={s.banner__title}>{props.title}</h1>
        {props.children}
      </div>
    </div>
  )
}

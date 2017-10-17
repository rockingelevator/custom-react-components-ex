import React from 'react';
import Checkbox from '../../forms/Checkbox';

import s from './Card.css';

export default function(props) {
  return (
    <div className={s.card + ' ' + (props.className || '')}>
      {
        props.showActionBar &&
        <div className={s.card__actions + ' ' + (props.active ? s.card__actions_active : '')}>
          <Checkbox
            isChecked={props.isSelected}
            handleChange={e => props.handleSelect(props.cardType, props.item)}
          />
          <i
            className={'icon-star' + (!props.active ? '-empty' : '') + ' ' + s.favIcon}
            onClick={e => props.handleChangeActive(props.cardType, props.item)}
          />
          <i className={'icon-paper-plane-empty ' + s.messageIcon + ' ' + s.withBubble} />
        </div>
      }
      <div className={s.card__body + ' ' + (props.showActionBar ? s.withBar : '')}>
        { props.children }
      </div>
    </div>
  );
}

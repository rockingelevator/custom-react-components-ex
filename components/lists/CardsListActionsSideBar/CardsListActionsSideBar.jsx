import React from 'react';
import Button from '../../forms/Button';

import s from './CardsListActionsSideBar.css';

function isIncludedNotFavorite(l=[]){
  for (let i in l) {
    if(!l[i].favorites) return true;
  }
  return false;
}

export default function(props) {
  const hasNotFav = isIncludedNotFavorite(props.selected);
  return (
    <div className={s.actionsSideBar}>
      {
        props.selected && props.selected.length > 0 &&
        <div>
          <Button
            label={ gettext('Скинути усi обраннi')  + ' (' + props.selected.length + ')'  }
            className={ 'default_button_outline' }
            handleClick={ props.handleUnselectAll }
          />
          <Button
            label={ gettext(hasNotFav ? 'Додати до' : 'Видалити з') + ' ' + gettext('обраних') }
            className={ 'default_button' }
            icon={ 'icon-star' }
            handleClick={ e => props.handleToggleFavList(hasNotFav) }
          />
        </div>
      }

    </div>
  );
}

import React from 'react';
import CVPreview from '../CVPreview';
import VacancyPreview from '../VacancyPreview';
import Button from '../../forms/Button';

import s from './CardsList.css';

function isSelected(l, itemId){
  for (let i in l){
    if(l[i].id == itemId)
      return true;
  }
  return false;
}

export default function(props) {

    const {
      items,
      isMore,
      fetchMore,
      selected
    } = props;

    return(
      <div>
        {
          items && items.map((item, i) => {
            switch(props.type){
              case 'cv':
                return (
                  <CVPreview
                    item={item}
                    key={'cv_preview_' + i}
                    handleChangeActive={props.handleChangeActive}
                    canAddToFav={props.user && props.user.role == 'employer'}
                    handleSelect={props.handleCardSelect}
                    isSelected={ isSelected(selected, item.id) }
                  />
                )
              case 'vacancy':
                return (
                  <VacancyPreview
                    item={item}
                    key={'vacancy_preview_' + i}
                    handleChangeActive={props.handleChangeActive}
                    canAddToFav={props.user && props.user.role == 'jobseeker'}
                    handleSelect={props.handleCardSelect}
                    isSelected={ isSelected(selected, item.id) }
                  />
                )
            }
          })
        }
        {
          isMore &&
          <Button
            label={gettext('Показати бiльше')}
            className={'default_button ' + s.fetchMoreBtn}
            handleClick={props.fetchMore}
          />
        }
      </div>
    );
}

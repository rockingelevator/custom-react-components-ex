import React from 'react';
import Card from '../Card';
import { Link } from 'react-router-dom';
import Button from '../../forms/Button';

import s from './SidePanelCardsList.css';

export default function(props) {
    return (
      <div className={s.sidePanelCardsList + ' ' + (props.className || '')}>
        {
          props.items && props.items.map((item, i) => {
            return (
              <Card
                active={item.favorites}
                handleChangeActive={props.handleChangeActive}
                item={item}
                showActionBar={props.showActions}
                key={'vacancy-link-' + i}
                className={ props.selectedItem.id_code == item.id_code ? s.selected : '' }
              >
                <div
                  className={s.sidePanelCardsList__card}
                >
                  <Link to={(props.type == 'vacancy' ? '/vacancies/' : '/cvs/') + item.id_code}>
                    <h2>{ item.header }</h2>
                  </Link>
                  <h3>{ item.jobseeker_name || item.name_company }</h3>
                </div>
              </Card>
            )
          })
        }
        {
          props.isMore &&
          <Button
            className={'default_button ' + s.fetchMoreBtn}
            handleClick={props.fetchMore}
            label={ gettext('Показати бiльше') }
          />
        }
      </div>
    );
}

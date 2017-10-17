import React from 'react';
import Card from '../../lists/Card';
import { Link } from 'react-router-dom';

import s from './VacancyPreview.css';
import cardStyles from '../../lists/Card/Card.css';

export default function(props) {
  const { item } = props;
  return (
    <Card
      active={item.favorites}
      handleChangeActive={props.handleChangeActive}
      item={item}
      showActionBar={props.canAddToFav}
      cardType={'vacancy'}
      handleSelect={props.handleSelect}
      isSelected={props.isSelected}
    >
      <Link to={`/vacancies/${item.id_code}`}>
        <h1>{item.header}</h1>
      </Link>
      <p className={cardStyles.subtitle}>{item.name_company}</p>
      <p className={cardStyles.sub_subtitle}>{item.address}</p>
      <p className={cardStyles.price}>{item.salary} {(item.currency || '').toUpperCase()}</p>
      <div className={cardStyles.summaryRow}>
        <div className={cardStyles.summaryCell}>
          {
            item.employment_type &&
              item.employment_type.map((employmentType, i) => {
                return (
                  <p key={'employment-type-' + i}>{employmentType.name}</p>
                )
              })

          }
        </div>
        <div className={cardStyles.summaryCell}>
          {
            item.experience_specialty &&
              item.experience_specialty.map((val, i) => {
                return <p key={'experience-specialty-' + i}>{val.name}</p>
              })
          }
        </div>
        <div className={cardStyles.summaryCell}>
          {
            item.time_schedules &&
              item.time_schedules.map((timeSchedule, i) => {
                return (
                  <p key={'thime-schedule-' + i}>{timeSchedule.name}</p>
                )
              })
          }
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../lists/Card';

import s from './CVPreview.css';
import cardStyles from '../../lists/Card/Card.css';

export default function(props) {
  const { item } = props;
  return (
    <Card
      active={item.favorites}
      handleChangeActive={props.handleChangeActive}
      item={item}
      showActionBar={props.canAddToFav}
      cardType={'cv'}
      handleSelect={props.handleSelect}
      isSelected={props.isSelected}
    >
      <Link to={`/cvs/${item.id_code}/`}>
        <h1>{item.header}</h1>
      </Link>
      <p className={cardStyles.subtitle}>{item.jobseeker_name}</p>
      <p className={cardStyles.sub_subtitle}>{item.jobseeker_address}</p>
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
        <div className={cardStyles.summaryCell}><p>{ item.experience_specialty && item.experience_specialty.name }</p></div>
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

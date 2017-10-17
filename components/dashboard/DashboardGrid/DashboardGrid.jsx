//TODO emplement to all dashboard related component

import React from 'react';
import NavPanel from '../NavPanel';
import HeaderPanel from '../HeaderPanel';

import s from './DashboardGrid.css';

export default function(props) {
  return (
    <div className={ s.dashboard }>
      <div className={ s.dashboard__content }>
        <div className={ s.dashboardContentWrapper}>
          <div className={ s.dashboardContentWrapper__row}>
            { props.children }
          </div>
        </div>
      </div>
      <HeaderPanel user={props.user}/>
      <NavPanel user={props.user}/>
    </div>
  );
}

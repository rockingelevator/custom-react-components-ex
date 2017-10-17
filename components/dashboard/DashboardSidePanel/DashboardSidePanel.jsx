import React from 'react';

import s from './DashboardSidePanel.css';

export default function(props) {
  return (
    <div className={`${s.dashboardSidePanel} ${s.sidepanel} ${props.right && s.sidepanel_right}`}>
      { props.children }
    </div>
  );
}

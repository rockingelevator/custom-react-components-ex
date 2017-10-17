import React from 'react';

import s from './Spinner.css';

export default function(props) {
  return (
    <i className={`icon-spin5 ${s.animateSpin} ${s.default} ${props.className || ''} ${props.show ? s.show : s.hide}`} />
  );
}

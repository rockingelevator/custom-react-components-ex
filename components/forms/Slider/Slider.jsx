import React from 'react';
import Slider, { Range } from 'rc-slider';

import s from './Slider.css';

export default function(props) {
  const Range = Slider.createSliderWithTooltip(Slider.Range);
  return (
      <Range
        min={props.min}
        max={props.max}
        step={props.step}
        marks={props.marks}
        allowCross={props.allowCross}
        defaultValue={props.defaultValue}
        onAfterChange={props.onAfterChange}
      />
  )
}

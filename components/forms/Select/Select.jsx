import React from 'react';
import Select from 'react-select';
import s from './Select.css';

export default function(props) {
  return (
    <div className={s.selectWrapper + ' ' + (props.className || '') + (props.errors ? ' error' : '')}>

      <label className='inputLabel'>
        {props.label}
      </label>
        {!props.creatable && !props.async &&
          <Select
            name={props.name}
            value={props.value}
            options={props.options}
            clearable={false}
            placeholder={props.placeholder || ''}
            searchable={props.searchable}
            onInputChange={props.handleInputChange}
            onChange={props.handleChange}
            noResultsText={props.noResultsText || ''}
          />
        }

        {props.creatable && !props.async &&
          <Select.Creatable
            name={props.name}
            value={props.value}
            options={props.options}
            clearable={false}
            placeholder={props.placeholder || ''}
            searchable={props.searchable}
            onChange={props.handleChange}
            newOptionCreator={props.newOptionCreator}
            onInputChange={props.onInputChange}
            noResultsText={props.noResultsText || ''}
          />
        }

        {props.creatable && props.async &&
          <Select.AsyncCreatable
            name={props.name}
            value={props.value}
            options={props.options}
            clearable={false}
            placeholder={props.placeholder || ''}
            searchable={props.searchable}
            onChange={props.handleChange}
            newOptionCreator={props.newOptionCreator}
            onInputChange={props.onInputChange}
            loadOptions={props.loadOptions}
          />
        }

      {
        props.errors &&
          <ul className={s.errorList}>
            {
              props.errors.map((error, i) => {
                return (
                    <li key={"error-" + i}>{error}</li>
                )
              })
            }
          </ul>
      }
    </div>
  )
}

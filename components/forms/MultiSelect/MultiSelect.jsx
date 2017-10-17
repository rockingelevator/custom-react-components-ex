import React from 'react';
import Select from 'react-select';
import selectStyles from '../Select/Select.css';

export default function(props) {
    return (
        <div className={selectStyles.selectWrapper + ' ' + (props.className || '') + (props.errors ? ' error' : '')}>

            <label className='inputLabel'>
                {props.label}
            </label>

            {!props.creatable && !props.async &&
                <Select
                    name={props.name}
                    multi={true}
                    value={props.value}
                    options={props.options}
                    clearable={false}
                    placeholder={props.placeholder || ''}
                    searchable={props.searchable}
                    onChange={props.handleChange}
                    newOptionCreator={props.newOptionCreator}
                    onInputChange={props.onInputChange}
                />
            }

            {props.creatable && !props.async &&
                <Select.Creatable
                    name={props.name}
                    multi={true}
                    value={props.value}
                    options={props.options}
                    clearable={false}
                    placeholder={props.placeholder || ''}
                    searchable={props.searchable}
                    onChange={props.handleChange}
                    newOptionCreator={props.newOptionCreator}
                    onInputChange={props.onInputChange}
                />
            }

            {!props.creatable && props.async &&
                <Select.Async
                    name={props.name}
                    multi={true}
                    value={props.value}
                    options={props.options}
                    clearable={false}
                    placeholder={props.placeholder || ''}
                    searchable={props.searchable}
                    onChange={props.handleChange}
                    newOptionCreator={props.newOptionCreator}
                    onInputChange={props.onInputChange}
                    loadOptions={props.loadOptions}
                    isValidNewOption={props.isValidNewOption}
                />
            }

            {props.creatable && props.async &&
                <Select.AsyncCreatable
                    name={props.name}
                    multi={true}
                    value={props.value}
                    options={props.options}
                    clearable={false}
                    placeholder={props.placeholder || ''}
                    searchable={props.searchable}
                    onChange={props.handleChange}
                    newOptionCreator={props.newOptionCreator}
                    onInputChange={props.onInputChange}
                    loadOptions={props.loadOptions}
                    isValidNewOption={props.isValidNewOption}
                />
            }

            {
                props.errors &&
                <ul className={selectStyles.errorList}>
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

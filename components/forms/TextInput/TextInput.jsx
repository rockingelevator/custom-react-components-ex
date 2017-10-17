import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import {
  requiredValidation,
  emailValidation,
  onlyNumbersValidation,
  phoneNumberValidation,
  urlValidation,
} from '../../../utils/validation';

import Dropdown from '../../forms/Dropdown';

import s from './TextInput.css';

class TextInput extends Component {
  constructor(props){
    super(props);
    this.state={
      focus: false,
      showDrop: false
    }
    this._handleBlur = this._handleBlur.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(this.state.focus && newProps.value != this.props.value && newProps.options)
      this.setState({showDrop: true});
  }

  handleClickOutside() {
    this.setState({showDrop: false});
  }

  _handleBlur(){
    this.setState({focus: false});
    if (!this.props.validation) return;
    let fieldErrors = [];
    let v;
    this.props.validation.map((validation) => {
      switch(validation){
        case 'required':
          v = requiredValidation(this.props.value);
          if (v.status == 'Fail') {
            fieldErrors.push(v.message);
          }
          break;
        case 'email':
          v = emailValidation(this.props.value);
          if (v.status == 'Fail') {
            fieldErrors.push(v.message);
          }
          break;
        case 'onlyNumbers':
          v = onlyNumbersValidation(this.props.value);
          if (v.status == 'Fail') {
              fieldErrors.push(v.message);
          }
          break;
        case 'phoneNumber':
            v = phoneNumberValidation(this.props.value);
            if (v.status == 'Fail') {
                fieldErrors.push(v.message);
            }
            break;
        case 'url':
            v = urlValidation(this.props.value);
            if (v.status == 'Fail') {
                fieldErrors.push(v.message);
            }
            break;
        default:
            return null;
      }
    });
    let err = {};
    err[this.props.name] = fieldErrors;
    this.props.handleFieldErrors(err);
  }

  _handleKeyPress(e) {
    if(e.keyCode == 27)
      this.setState({showDrop: false});
    if(!this.props.handleEnterPressed) return;
    if(e.keyCode==13){
      this.setState({showDrop: false});
      this.props.handleEnterPressed(e);
    }
  }

  _toggleDrop() {
    const { showDrop } = this.state;
    this.setState({showDrop: !showDrop});
  }

  _handleOptionSelect(option) {
    this.setState({showDrop: false});
    this.props.handleOptionSelect(option);
  }


  render(){
    const { focus, showDrop } = this.state;
    const onlyNumbers = this.props.validation && this.props.validation.indexOf('onlyNumbers') > -1;
    let error = typeof this.props.errors != 'undefined' && this.props.errors.length > 0;
    return (
      <div className={s.textInputWrapper + ' ' + (this.props.className || '') + (error ? ' error' : '')}>
        <label className={'inputLabel ' + (focus ? 'inputLabel_focus' : 'inputLabel_default')}>
          {this.props.label}
        </label>
        <input
          id={this.props.id || null}
          type={this.props.type || "text"}
          className={s.textInput}
          onFocus={()=>{this.setState({focus: true})}}
          onBlur={this._handleBlur}
          placeholder={this.props.placeholder || ''}
          value={this.props.value || ''}
          onChange={this.props.handleChange}
          name={this.props.name || ""}
          onKeyDown={this._handleKeyPress.bind(this)}
          ref={this.props.inputRef}
          disabled={this.props.disabled}
          onClick={this._toggleDrop.bind(this)}
        />
      { showDrop && this.props.options && this.props.options.length > 0 &&
        <Dropdown
          options={this.props.options}
          handleOptionSelect={this._handleOptionSelect.bind(this)}
        />
      }
        {
          !this.state.fieldErrors && this.props.errors &&
            <ul className={s.errorList}>
              {
                this.props.errors.map((error, i) => {
                  return (
                      <li key={"error-" + i}>{error}</li>
                  )
                })
              }
            </ul>
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(TextInput);

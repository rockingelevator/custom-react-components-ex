import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

import {
  requiredValidation,
} from '../../../utils/validation';

import s from './TextArea.css';

export default class TextInput extends Component {
    constructor(props){
        super(props);
        this.state={
            focus: false,
        };
        this._handleBlur = this._handleBlur.bind(this);
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
            // any other cases should be placed here
            default:
                return null;
          }
        });
        let err = {};
        err[this.props.name] = fieldErrors;
        this.props.handleFieldErrors(err);
    }

    _handleKeyPress(e) {
        if(!this.props.handleEnterPressed) return;
        if(e.charCode==13){
            this.props.handleEnterPressed(e);
        }
    }


    render(){
        const { focus } = this.state;
        let error = typeof this.props.errors != 'undefined' && this.props.errors.length > 0;
        return (
            <div className={s.textAreaWrapper + (error ? ' error' : '')}>
                <label className={'inputLabel ' + (focus ? 'inputLabel_focus' : 'inputLabel_default')}>
                    {this.props.label}
                </label>
                <Textarea
                    id={this.props.id || null}
                    className={s.textArea}
                    onFocus={()=>{this.setState({focus: true})}}
                    onBlur={this._handleBlur}
                    placeholder={this.props.placeholder || ''}
                    onChange={this.props.handleChange}
                    name={this.props.name || ""}
                    value={this.props.value}
                    onKeyPress={this._handleKeyPress.bind(this)}
                />
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

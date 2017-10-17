import React, { Component } from 'react';
import { RadioGroup, RadioButton } from 'react-custom-radio';
import component_style from './RequireRoleForm.css';
import s from '../../common/Modal/Modal.css';
import cs from '../../../css/common.css';
import Button from '../../forms/Button';
import TextInput from '../../forms/TextInput';


export default class RequireRoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 'jobseeker'
    };
  }

  render(){
    let url = '/complete/' + this.props.backend + '/';
    return (
      <div className={s.modalContent}>
        <h1 className={s.modalTitle}>{gettext("Обов'язкове поле")}</h1>
        <form action={url} method="post">
          <TextInput
            name="role"
            type="hidden"
            value={this.state.role}
          />
          <RadioGroup
            name="role"
            selectedValue={this.state.role}
            className={s.radiogroup + ' ' + component_style.roleSelect}
            onChange={(role) => {
              this.setState({role})
            }}
          >
            <RadioButton value="jobseeker" className={cs.radio}>
              {gettext('Я кандидат')}
            </RadioButton>
            <RadioButton value="employer" className={cs.radio}>
              {gettext('Я роботодавець')}
            </RadioButton>
          </RadioGroup>
          <Button
            type="submit"
            label={gettext('Далi')}
            className={s.modalButton + ' ' + s.modalButton_full}
          />
        </form>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTelInput from 'react-telephone-input'
import TextInput from '../../forms/TextInput';
import Button from '../../forms/Button';
import FormFooter from '../../forms/FormFooter';
import Radiogroup from '../../forms/Radiogroup';
import Select from '../../forms/Select';
import Modal from '../../common/Modal';
import DayMonthYearRow from '../../forms/DayMonthYearRow';
import { max_upload_file_size } from '../../../constants';
import AvatarDrop from '../../forms/AvatarDrop';
import { confirmUserPhone } from '../../../actions/userActions';
import { confirmUserPinCode } from '../../../actions/userActions';

import s from './ProfileInfoForm.css';
import sm from '../../common/Modal/Modal.css';

class ProfileInfoForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      user: null,
      bDay: null,
      bMonth: null,
      bYear: null,
      uploadingUserpic: false,
      phoneIsconfirmed: false,
      showButtonConfirm: false,
      showModalPinCode: false,
      pinCode: '',
      errorPinCode: '',
      isValidPinCode: null
    };
    this._handlePinCodeChange = this._handlePinCodeChange.bind(this);
    this._handlePhoneChange = this._handlePhoneChange.bind(this);
    this._confirmMainPhone = this._confirmMainPhone.bind(this);
    this._confirmPinCode = this._confirmPinCode.bind(this);
    this._closeModalPinCode = this._closeModalPinCode.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleAdditionalPhoneChange = this._handleAdditionalPhoneChange.bind(this);
    this._addAdditionalPhoneBlock = this._addAdditionalPhoneBlock.bind(this);
    this._removeAdditionalPhoneBlock = this._removeAdditionalPhoneBlock.bind(this);
    this._handleBasePhoneChange = this._handleBasePhoneChange.bind(this);
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Основна iнформацiя')); //pass form title to parent component
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  componentWillReceiveProps(newProps){
    this.setState({uploadingUserpic: false});
    if(!newProps.user || Object.keys(newProps.user).length == 0) return;
    if (!this.state.user) {
      let year = null;
      let month = null;
      let day = null;
      if (newProps.user.birthday) {
        let birthday = new Date(newProps.user.birthday);
        year = birthday.getFullYear();
        month = birthday.getMonth();
        day = birthday.getDate();
      }
      this.setState({
        user: newProps.user,
        bYear: year,
        bMonth: month,
        bDay: day,
        phoneIsconfirmed: newProps.user.phone_isconfirmed,
        showButtonConfirm: (newProps.user.phone && !newProps.user.phone_isconfirmed),
      });
    }

    //
    // if(newProps.user.additional_phones && typeof this.state.user.additional_phones === 'undefined'){
    //   this.setState({user: {...this.state.user, additional_phones: newProps.user.additional_phones}});
    // }

  }

  _handleSubmit(){
    const { user, bDay, bMonth, bYear } = this.state;
    const birthday = bYear && (bMonth >= 0) && bDay ? `${bYear}-${bMonth+1}-${bDay}` : null;

    let data = {
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      phone: user.phone,
      gender: user.gender,
      birthday: birthday,
      additional_phones: user.additional_phones
    };
    this.props.handleSubmit('info', data);
  }

  _handleUserpicSelect(files) {
    const file = files[0];
    const data = new FormData();
    if (file && file.size > max_upload_file_size ) {
      this.setState({errors : { photo: [gettext('Розмір файла завеликий, максимальний розмір 1Mb')] }})
    } else {
      data.append("photo", file);
      this.setState({uploadingUserpic: true, errors: {}});
      this.props.handleSubmit('photo', data);
    }
  }

  _handlePhoneChange(telNumber, selectedCountry) {
    if (!this.state.user)
      return;
    telNumber = telNumber.substr(0,17);
    this._setPhoneIsconfirmed(telNumber);

    if (telNumber.length < 4) {
      this.setState({user: {...this.state.user, phone: '+380'}})
    } else {
      this.setState({user: {...this.state.user, phone: telNumber}})
    }

    this.setState({isValidPinCode: null, errorPinCode: ''})
  }

  _setPhoneIsconfirmed(telNumber){
    let newTel = telNumber.replace(/ /g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/-/g,"");
    let oldTel = (this.props.user.phone && this.props.user.phone.replace(/ /g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/-/g,""));

    if (newTel != oldTel) {
      this.setState({phoneIsconfirmed: false});

      if (telNumber.length == 17) {
        this.setState({showButtonConfirm: true})
      } else {
        this.setState({showButtonConfirm: false})
      }

    } else if (oldTel && newTel == oldTel){
      if (this.props.user.phone_isconfirmed) {
        this.setState({phoneIsconfirmed: true, showButtonConfirm: false})
      } else {
        this.setState({showButtonConfirm: true})
      }
    }
  }

  _confirmMainPhone() {
    this.setState({showModalPinCode: true, showButtonConfirm: false});
    this.props.confirmUserPhone(this.state.user.id, {phone: this.state.user.phone})
  }

  _confirmPinCode() {
    this.props.confirmUserPinCode(this.state.user.id, {pinCode: this.state.pinCode})
    .then(response => {
      if(response.error){
        this.setState({errorPinCode: response.error.response.data.pin_code})
      } else {
        this.setState({
          isValidPinCode: true,
          phoneIsconfirmed: true,
          errorPinCode: ''
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  _closeModalPinCode() {
    document.body.classList.remove('locked');
    this.setState({
      showModalPinCode: false,
      showButtonConfirm: !this.state.phoneIsconfirmed,
      errorPinCode: '',
      pinCode: ''
    });
  }

  _handlePinCodeChange(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substr(0,4);

    if (value.length == 3) {
      value = value.substr(0,2) + '-' + value[2];
    } else if (value.length > 3) {
      value = value.substr(0,2) + '-' + value.substr(2,4);
    }

    this.setState({pinCode: value})
  }

  _handleAdditionalPhoneChange(telNumber, i) {
    let selectedPhone = this.state.user.additional_phones;
    telNumber = telNumber.substr(0,17);
    if (telNumber.length < 4) {
      telNumber = '+380'
    }
    selectedPhone[i] = telNumber;
    this.setState({user: {...this.state.user, additional_phones: selectedPhone}});
  }

  _addAdditionalPhoneBlock(e) {
    let additionalPhone = this.state.user.additional_phones;
    additionalPhone.push('+380');
    this.setState({user: {...this.state.user, additional_phones: additionalPhone}});
  }

  _removeAdditionalPhoneBlock(i){
    let additionalPhone = this.state.user.additional_phones;
    additionalPhone.splice(i, 1);
    this.setState({user: {...this.state.user, additional_phones: additionalPhone}});
  }

  _handleBasePhoneChange(phone) {
    let phones = [...this.state.user.additional_phones]
    const i = phones.indexOf(phone);
    if (i > -1)
      phones.splice(i,1);
    phones.unshift(this.state.user.phone);
    this._setPhoneIsconfirmed(phone);
    this.setState({
      user: {
        ...this.state.user,
        phone: phone,
        additional_phones: phones
      },
      isValidPinCode: null,
      errorPinCode: ''
    });

  }

  render() {
    const { errors } = this.props;
    const { user } = this.state;
    return (
      <div>
        <AvatarDrop
          handleDrop={ this._handleUserpicSelect.bind(this) }
          uploading={ this.state.uploadingUserpic }
          img={ this.props.user.photo }
          errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
        />
        <TextInput
          name='first_name'
          label={gettext("Iм'я")}
          value={(user && user.first_name) || ''}
          handleChange={(e) => {this.setState({user: {...user, first_name: e.target.value} })}}
          errors={errors.first_name}
          validation={['required']}
          handleFieldErrors={this.props.handleErrors}
          inputRef={el => this.inputElementFocus = el}
        />
        <TextInput
          name='last_name'
          label={gettext("Прiзвище")}
          value={(user && user.last_name) || ''}
          handleChange={(e) => {this.setState({user: {...user, last_name: e.target.value} })}}
          errors={errors.last_name}
          validation={['required']}
          handleFieldErrors={this.props.handleErrors}
        />
        <TextInput label={gettext("По батьковi")}
          value={(user && user.middle_name) || ''}
          handleChange={(e) => {this.setState({user: {...user, middle_name: e.target.value} })}}
          errors={errors.middle_name}
        />
        <Radiogroup
          label={gettext('Стать')}
          options={[
            {label: gettext('Я чоловiк'), value: 'm'},
            {label: gettext('Я жiнка'), value: 'f'},
            {label: gettext('Не обрано'), value: null},
          ]}
          selected={user && user.gender}
          className={s.genderSelect}
          handleChange={(selected) => {this.setState({user: {...user, gender: selected}})}}
        />

        <div className="textInputTelephone">
          <label className='inputLabel inputLabel_default'>{gettext('Телефон')}&nbsp;({gettext('основний')})</label>
          <ReactTelInput
            defaultCountry="ua"
            value={(user && user.phone) || ''}
            onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0 }]}
            onChange={this._handlePhoneChange}
            flagsImagePath="/static/img/flags.png"
            classNames="reactTelephoneInput"
          />
        {/*<i className={'icon-asl ' + s.iconBasePhone + ' active'} />*/}
          { user && this.state.phoneIsconfirmed &&
            <div className="reactInputChecked">
              <input
                type="checkbox"
                checked="checked"
                disabled="disabled"
              />
              <label htmlFor="" title={gettext("Телефон підтверджено")}></label>
            </div>
          }
          { user && this.state.showButtonConfirm &&
            <Button
              type="button"
              handleClick={this._confirmMainPhone}
              label={gettext("Підтвердити телефон")}
              className={"default_button_outline " + s.btnPhoneConfirm}
            />
          }
        </div>
        { errors.phone &&
          <ul className={s.errorList}>
            {errors.phone.map((error, i) => {
              return (
                <li key={"error-" + i}>{error}</li>
              )})
            }
          </ul>
        }

        <label className='inputLabel inputLabel_default'>{gettext('Додаткові номера телефонів')}</label>
        {user && user.additional_phones && user.additional_phones.map((phone, i) => {
          return (
            <div key={'additional_phones-' + i}>
              <ReactTelInput
                defaultCountry="ua"
                value={phone}
                onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0 }]}
                onChange={(telNumber, selectedCountry) => {this._handleAdditionalPhoneChange(telNumber, i)}}
                flagsImagePath="/static/img/flags.png"
                classNames="reactTelephoneInput"
              />
              <a
              className='removeRowIcon'
              onClick={e => this._removeAdditionalPhoneBlock(i)}
              >
                <i className='icon-cancel'/>
              </a>
              <i
                className={'icon-asl ' + s.iconBasePhone}
                onClick={e => this._handleBasePhoneChange(phone)}
              />
            </div>
          )
        })}
        {errors.additional_phones &&
          <ul className={s.errorList}>
            {errors.additional_phones.map((error, i) => {
                return (
                  <li key={"error-" + i}>{error}</li>
                )
            })}
          </ul>
        }
        <a
          className='formlink'
          onClick={this._addAdditionalPhoneBlock}
        >{gettext('+ Додати телефон')}
        </a>
        <DayMonthYearRow
           day={this.state.bDay}
           month={this.state.bMonth}
           year={this.state.bYear}
           handleChange={(data) => { this.setState(data) }}
           errors={errors.birthday}
        />
        <FormFooter
          handleSubmit={this._handleSubmit}
          fetching={this.props.fetching}
        />

        <Modal
          show={ this.state.showModalPinCode }
          handleClose={this._closeModalPinCode}
        >
        {this.state.showModalPinCode && document.body.classList.add('locked')}
        <div className={sm.modalContent}>
          <h1 className={sm.modalTitle}>{gettext('Перевірка телефона')}</h1>

          {this.state.isValidPinCode && <p>{gettext('Телефон підтверджено')}</p>}
          {!this.state.isValidPinCode &&
            <div>
              <TextInput label={gettext("Введіть код, який ви отримали на телефон")}
                value={this.state.pinCode}
                handleChange={this._handlePinCodeChange}
                errors={this.state.errorPinCode}
                inputRef={el => {
                  if (el) {el.focus()}
                }}
              />
              <Button
                label={gettext('Підтвердити')}
                className={sm.modalButton + " default_button"}
                handleClick={this._confirmPinCode}
              />
              <p>{gettext('якщо вам не прийшла смс протягом')} <br />{gettext('30 секунд')} </p>
              <Button
                type="button"
                handleClick={() => { this._closeModalPinCode(); setTimeout(this._confirmMainPhone, 0)}}
                label={gettext("запросити код ще раз")}
                className={sm.modalButton + ' ' + sm.modalButton_outline}
              />
            </div>
          }
        </div>
      </Modal>
    </div>
  );}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    confirmUserPhone,
    confirmUserPinCode
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ProfileInfoForm);

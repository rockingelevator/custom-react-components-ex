import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';


export default class ProfileEmailForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      email: '',
      new_email: '',
      errors: {}
    };
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Електронна пошта')); //pass form title to parent component
    this.setState({
      'email': this.props.user.email,
      'new_email': this.props.user.new_email
    })
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user && !this.state.email) {
      this.setState({
        'email': newProps.user.email,
        'new_email': newProps.user.new_email
      })
    }
  }

  _handleSubmit(){
    this.props.handleSubmit('email', {new_email: this.state.new_email});
  }

  render() {
    return (
      <div>
        <TextInput
          label={gettext("Електронна пошта (активна)")}
          value={this.state.email}
          disabled
        />
        <TextInput
          name='email'
          label={gettext("Змінити електронну пошту на")}
          value={this.state.new_email}
          handleChange={(e) => {this.setState({new_email: e.target.value})}}
          errors={this.props.errors.email}
          handleFieldErrors={this.props.handleErrors}
          validation={['email']}
          inputRef={el => this.inputElementFocus = el}
        />
        { !this.props.errors.email && this.state.new_email && this.state.new_email == this.props.user.new_email &&
          <p>{gettext('Перевірте пошту, та активуйте нову електронну пошту.')}</p>
        }

        <FormFooter
          handleSubmit={this._handleSubmit}
          fetching={this.props.fetching}
        />
      </div>
    );
  }
}

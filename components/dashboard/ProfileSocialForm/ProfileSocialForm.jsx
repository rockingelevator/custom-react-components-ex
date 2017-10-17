import React, { Component } from 'react';
import Cookie from "js-cookie";
import TextInput from '../../forms/TextInput';
import Button from '../../forms/Button';
import FormFooter from '../../forms/FormFooter';

import s from './ProfileSocialForm.css';

export default class ProfileAddressForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      user: {}
    }
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Соцiальнi мережi')); //pass form title to parent component
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _renderSocialAuth(socialAuthId, socialAuthBackend, socialAuthName) {
    let action, nameButton, className;
    if (socialAuthId) {
      action = '/disconnect/' + socialAuthBackend + '/' + socialAuthId + '/?next=/dashboard/profile/edit/social/';
      nameButton = gettext("Відкріпити аккаунт") + ' ' + socialAuthName;
      className = 'button_left default_button'
    } else {
      action = '/login/' + socialAuthBackend + '/?next=/dashboard/profile/edit/social/';
      nameButton = gettext("Зв'язати аккаунт") + ' ' + socialAuthName;
      className = 'button_left default_button_outline'
    }

    return (
      <form method="POST" action={action}>
        <input type="hidden" name="csrfmiddlewaretoken" value={Cookie.get('csrftoken')} />
        <input type="hidden" name="next" value='/dashboard/profile/edit/social/' />
        <Button
          className={className}
          type="submit"
          label={nameButton}
        />
      </form>
    )
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <TextInput
          label={gettext("Facebook")}
          value={typeof user.facebook === 'undefined' ? this.props.user.facebook : user.facebook}
          handleChange={(e) => {this.setState({user: {...user, facebook: e.target.value} })}}
          inputRef={el => this.inputElementFocus = el}
        />
        {this._renderSocialAuth(this.props.user.social_auth_facebook_id, 'facebook', gettext("Facebook"))}

        <TextInput
          label={gettext("VK")}
          value={typeof user.vk === 'undefined' ? this.props.user.vk : user.vk}
          handleChange={(e) => {this.setState({user: {...user, vk: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_vk_id, 'vk-oauth2', gettext("VK"))}

        <TextInput
          label={gettext("LinkedIn")}
          value={typeof user.linkedin === 'undefined' ? this.props.user.linkedin : user.linkedin}
          handleChange={(e) => {this.setState({user: {...user, linkedin: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_linkedin_id, 'linkedin-oauth2', gettext("LinkedIn"))}

        <TextInput
          label={gettext("Однокласники")}
          value={typeof user.ok === 'undefined' ? this.props.user.ok : user.ok}
          handleChange={(e) => {this.setState({user: {...user, ok: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_ok_id, 'odnoklassniki-oauth2', gettext("Однокласники"))}

        <TextInput
          label={gettext("Twitter")}
          value={typeof user.twitter === 'undefined' ? this.props.user.twitter : user.twitter}
          handleChange={(e) => {this.setState({user: {...user, twitter: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_twitter_id, 'twitter', gettext("Twitter"))}

        <TextInput
          label={gettext("Google Plus")}
          value={typeof user.google_plus === 'undefined' ? this.props.user.google_plus : user.google_plus}
          handleChange={(e) => {this.setState({user: {...user, google_plus: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_google_plus_id, 'google-oauth2', gettext("Google Plus"))}

        <TextInput
          label={gettext("Instagram")}
          value={typeof user.instagram === 'undefined' ? this.props.user.instagram : user.instagram}
          handleChange={(e) => {this.setState({user: {...user, instagram: e.target.value} })}}
        />
        {this._renderSocialAuth(this.props.user.social_auth_instagram_id, 'instagram', gettext("Instagram"))}

        <FormFooter
          handleSubmit={() => {this.props.handleSubmit('social', user) }}
          fetching={this.props.fetching}
        />
      </div>
    );
  }
}

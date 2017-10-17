import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../common/Avatar';
import enhanceWithClickOutside from 'react-click-outside';

import s from './HeaderUserBox.css';

class ProfileDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrop: false
    }
  }

  handleClickOutside() {
    this.setState({showDrop: false});
  }

  render() {
    const user = this.props.user || {};
    let username = gettext('Профайл');
    let linkProfile = '/dashboard/profile/edit/';
    if (user.role == 'jobseeker') {
      username = user.first_name ? user.first_name: user.email
    } else {
      username = user.company_name ? user.company_name: user.email;
      linkProfile = '/dashboard/employer/edit/';
    }
    return (
      <div
        className={s.userBox}
        onClick={e => {this.setState({showDrop: !this.state.showDrop})}}
      >
        <Avatar
          src={ user.photo || user.logo }
        />
        <div className={s.userBox__textPart}>
          <p className='userBox__name' dangerouslySetInnerHTML={{__html: username }} />
          <p className={s.userRole}>
            {user.role == 'jobseeker' ? gettext('Кандидат') : gettext('Роботодавець')}
          </p>
        </div>
        <i className={'icon-angle-' + (this.state.showDrop ? 'up' : 'down') + ' ' + s.userBox__iconOpen} />
        <div className={s.profileDropdown + ' ' + (this.state.showDrop ? s.show : s.hide)}>
          <ul>
            <Link to={linkProfile}>
              <li>{ gettext('Профайл') }</li>
            </Link>
            <a href="/logout/" >
              <li className={s.logout}>{ gettext('Вийти') }</li>
            </a>
          </ul>
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(ProfileDropdown);

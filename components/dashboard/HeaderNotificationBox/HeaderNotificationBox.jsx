import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import enhanceWithClickOutside from 'react-click-outside';

import s from './HeaderNotificationBox.css';

class HeaderNotificationBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrop: false
    };
  }

  handleClickOutside() {
    this.setState({showDrop: false});
  }

  render() {
    const { items, totalCount } = this.props;
    return (
      <div className={s.headerNotificationWrapper}>
        <i
          className={'icon-bell ' + s.serviceIcon}
          onClick={ e => this.setState({showDrop: !this.state.showDrop}) }
        />
      <div className={s.headerNotificationBox + ' ' + (this.state.showDrop ? 'show' : 'hide')}>
          {
            (!items || (items && items.length < 1)) &&
            <p className={s.noNotification}>
              <i className='icon-megaphone' /><br />
              { gettext('У вас поки немає нових повідомлень') }
            </p>
          }
          <ul>
            { items && items.length > 0 &&
              items.map((item, i) => {
                return (
                  <Link key={'notification-' + i} to=''>
                    <li>some</li>
                  </Link>
                )
              })
            }
            {
              items && totalCount > items.length &&
                <li className={s.showAllItems}>
                  { gettext('Показати все') }
                </li>
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default enhanceWithClickOutside(HeaderNotificationBox);

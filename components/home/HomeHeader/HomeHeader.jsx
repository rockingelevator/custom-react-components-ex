import React from 'react';
import s from './HomeHeader.css';
import Button from '../../forms/Button';

export default function HomeHeader(props) {
  let linkProfile = '';
  let authButton =
    <Button
      label={gettext('Увiйти')}
      className={s.header_btn}
      handleClick={(e) => props.openAuthModal({type: 'login'})}
    />;

  if (props.user.is_authenticated) {
    authButton =
      <Button
        label={gettext('Вийти')}
        className={s.header_btn}
        handleClick={(e) => {window.location.href="/logout/"}}
      />;

    let username;
    let link = props.user.role == 'jobseeker' ? '/dashboard/profile/edit/' : '/dashboard/employer/edit/';

    if (props.user.role == 'jobseeker') {
      username = props.user.first_name ? props.user.first_name: props.user.email
    } else if (props.user.role == 'employer') {
      username = props.user.company_name ? props.user.company_name: props.user.email
    }

    linkProfile =
      <a href={link} title={username}>
        {username}
      </a>
  }

  return (
    <div className={s.home_header__wrapper}>
      <a className={`${s.logo} ${s.header__logo}`}></a>
      <ul className={s.header_navigation}>
        <li className={`${s.header_navigation__navitem} ${s.header_navigation__navitem_active}`}><a className={s.navitem__link}>{gettext('Кандидатам')}</a></li>
        <li className={s.header_navigation__navitem}><a className={s.navitem__link}>{gettext('Рекрутерам')}</a></li>
        <li className={s.header_navigation__navitem}><a className={s.navitem__link}>{gettext('Роботодавцям')}</a></li>
        <li className={s.header_navigation__navitem}><a className={s.navitem__link}>{gettext('Про сервic')}</a></li>
        <li className={s.header_navigation__navitem}>
          <a className={s.navitem__link}>
            <i className='icon-search' />
          </a>
        </li>
      </ul>
      <div className={s.auth_controls_box}>
        {linkProfile}&nbsp;&nbsp;
        {authButton}
      </div>
    </div>
  )
}

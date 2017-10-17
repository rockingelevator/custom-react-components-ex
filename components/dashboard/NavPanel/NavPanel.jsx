import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import s from './NavPanel.css';

export default function(props) {
  return (
    <div className={s.navpanel + ' ' + s.navpanel_full}>
        <Link to='/'>
          <span className={s.navpanel__logo} />
        </Link>
        <ul className={s.navpanel__navigation}>
          <NavLink exact to='/dashboard/'>
            <li className={s.navigation__item}>
                <i className="icon-home"/>
                <span className={s.navItem__text}>{ gettext('Початок') }</span>
            </li>
          </NavLink>

          {
            props.user && props.user.role == 'jobseeker' &&
            <NavLink to='/dashboard/my_cv/'>
              <li className={s.navigation__item}>
                  <i className="icon-profile-card"/>
                  <span className={s.navItem__text}>{ gettext('Мої резюме') }</span>
              </li>
            </NavLink>
          }

          {
            props.user && props.user.role != 'jobseeker' &&
            <NavLink to='/dashboard/my_vacancies/'>
              <li className={s.navigation__item}>
                  <i className="icon-profile-book"/>
                  <span className={s.navItem__text}>{ gettext('Мої вакансії') }</span>
              </li>
            </NavLink>
          }

          <NavLink to='/dashboard/match/'>
            <li className={s.navigation__item}>
                <i className="icon-flash"/>
                <span className={s.navItem__text}>{ gettext('Збіг') }</span>
            </li>
          </NavLink>

          <NavLink to='/dashboard/favorites/'>
            <li className={s.navigation__item}>
                <i className="icon-star"/>
                <span className={s.navItem__text}>{ gettext('Відібрані') }</span>
            </li>
          </NavLink>

          <NavLink to='/dashboard/proposals/'>
            <li className={s.navigation__item}>
                <i className="icon-briefcase"/>
                <span className={s.navItem__text}>{ gettext('Пропозиції') }</span>
            </li>
          </NavLink>
        </ul>
        <NavLink
          to={`/dashboard/${props.user && props.user.role == 'jobseeker' ? 'profile' : 'employer'}/edit/`}
          >
          <div className={s.navigation__item + ' ' + s.navigation__settingsButton}>
              <i className="icon-cog" />
              <span className={s.navItem__text}>{ gettext('Налаштування') }</span>
          </div>
        </NavLink>
    </div>
  )
}

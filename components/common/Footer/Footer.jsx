import React from 'react';
import s from "./Footer.css";

export default function(props) {
  // TODO
  return (
    <div className={s.footer}>
      <div className={s.footercell}>
        <ul className={s.footercell__footerlist}>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Про проект')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Відгуки')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Новини порталу')}</a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Партнери')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Вакансії')} </a>
          </li>
        </ul>
      </div>

      <div className={s.footercell}>
        <ul className={s.footercell__footerlist}>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Кандидатам')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Рекрутерам')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Кадровим агенцiям')}</a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Роботодавцям')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Партнерам')} </a>
          </li>
        </ul>
      </div>

      <div className={s.footercell}>
        <ul className={s.footercell__footerlist}>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Допомога')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Рейтинг компаній')} </a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Робота в інших містах')}</a>
          </li>
        </ul>
      </div>

      <div className={s.footercell}>
        <ul className={s.footercell__footerlist}>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Прайс-лист')}</a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Просування резюме')}</a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Робота в інших містах')}</a>
          </li>
          <li className={s.footerlist__footeritem}>
            <a className={s.footeritem__footerlink}>{gettext('Захист персональних відомостей')}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

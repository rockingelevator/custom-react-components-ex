import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapsible from 'react-collapsible';
import moment from 'moment';

import { getVacancy } from '../../../actions/searchActions';

import Avatar from '../../common/Avatar';
import Tags from '../../forms/Tags';
import CollapseSection from '../../common/CollapseSection';

import s from '../../dashboard/ResumeContent/ResumeContent.css';


class VacancyDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idCode: null,
    };
  }

  componentWillMount(){
    const idCode = this.props.match.params.id;
    this.setState({idCode: idCode});
    this.props.getVacancy(idCode)
      .then(response => {
      })
      .catch(error => {
          console.log(error);
      })
  }

  componentWillReceiveProps(newProps){
    const idCode = newProps.match.params.id;

    if (idCode != this.state.idCode) {
      this.setState({idCode: idCode});
      this.props.getVacancy(idCode)
      .then(response => {
      })
      .catch(error => {
          console.log(error);
      })
    }
  }

  _getTagsFromList = (input) => {
    let output = [];
    if(!input) return output;
    input.map(val => {output.push(val.name)});
    return output;
  };

  _getLanguageTags = (input) => {
      let output = [];
      if(!input) return output;
      input.map(val => {
          output.push(val.language_name.toLowerCase() + ' : ' + val.skill);
      });
      return output;
  };

  render(){
    const { vacancy } = this.props;
    let mustSkills = [];
    let otherSkills = [];
    if (vacancy.skills) {
      vacancy.skills.map(skill => {
        if(skill.is_must) {
          mustSkills.push(skill);
        } else {
          otherSkills.push(skill);
        }
      });
    }

    return (
      <div className="singleBox__page">
        <div className={s.topBoxResume + ' ' + s.topBoxResume_active}>
          <div className={s.topBoxResume__header}>
            <p>{gettext('Код ваканії:')}&nbsp;&nbsp;<span className={s.value}>{vacancy.id_code}</span></p>
            <p>{gettext('Створено:')}&nbsp;&nbsp;
              <span className={s.value}>
                {moment(vacancy.date_update).format("DD.MM.YYYY")}
              </span>
            </p>
          </div>

          <div>
            <div className={s.topBoxResume__content}>
              <div className={s.topBoxResume__leftPart}>
                <Avatar
                  size="large"
                  src={vacancy.logo_company}
                />
              </div>
              <div className={s.topBoxResume__rightPart}>
                <div className={s.topBoxResume__titlePart}>
                  <h2>{vacancy.header}</h2>
                  <p>
                    {vacancy.address}
                  </p>
                  <h3>{vacancy.name_company}</h3>
                  <Tags
                    tags={this._getTagsFromList(vacancy.scope_activity)}
                  />
                </div>
                {vacancy.salary &&
                <div className={s.topBoxResume__sidePart}>
                  <h3>
                    { vacancy.salary }
                    <span className={s.small}> {vacancy.currency && vacancy.currency.toUpperCase()}</span>
                  </h3>
                </div>
                }
              </div>
            </div>
          </div>
        </div>

        <Collapsible
          trigger={<CollapseSection label={gettext('Про вакансію')} />}
          transitionTime={200}
          open={true}
        >
          <div className={s.mainBoxResume}>
            <ul className='listTable'>
              <li>
                <label>{gettext('Опис вакансії:')}</label>
                <div className='listTable__value'>
                  {vacancy.about}
                </div>
              </li>
              <li>
                <label>{gettext("Обов'язки:")}</label>
                <div className='listTable__value'>
                  {vacancy.description}
                </div>
              </li>
              <li>
                <label>{gettext('Про компанію:')}</label>
                <div className='listTable__value'>
                  {vacancy.about_company}
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Компетенції')} />}
          transitionTime={200}
          open={true}
        >
          <div className={s.mainBoxResume}>
            <ul className='listTable'>
              <li>
                <label>{gettext('Освіта:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(vacancy.education_levels)}
                  />
                </div>
              </li>
              <li>
                <label>{gettext('Досвід:')}</label>
                <div className='listTable__value'>
                    {/*TODO get value */}
                </div>
              </li>
              <li>
                <label>{gettext('Ключові компетенціі:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(mustSkills)}
                  />
                </div>
              </li>
              <li>
                <label>{gettext('Бажані компетенціі:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(otherSkills)}
                  />
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Умови')} />}
          transitionTime={200}
          open={true}
        >
          <div className={s.mainBoxResume}>
            <ul className='listTable'>
              <li>
                <label>{gettext('Вид зайнятостi:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(vacancy.employment_type)}
                  />
                </div>
              </li>
              <li>
                <label>{gettext('Графiк:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(vacancy.time_schedules)}
                  />
                </div>
              </li>
              <li>
                <label>{gettext('Умови:')}</label>
                <div className='listTable__value'>
                  {vacancy.working_conditions}
                </div>
              </li>
              <li>
                <label>{gettext('Переваги:')}</label>
                <div className='listTable__value'>
                  <Tags
                    tags={this._getTagsFromList(vacancy.advantages)}
                  />
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Володiння мовами')} />}
          transitionTime={200}
          open={vacancy.language_skills && vacancy.language_skills.length > 0}
        >
          <div className={s.mainBoxResume}>
            <ul className='listTable'>
              <li>
                <label>{gettext('Мови:')}</label>
                <div className='listTable__value'>
                  <Tags tags={this._getLanguageTags(vacancy.language_skills)}/>
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Курси')} />}
          transitionTime={200}
          open={vacancy.courses && vacancy.courses.length > 0}
        >
          <div className={s.mainBoxResume}>
            {
              vacancy.courses && vacancy.courses.map((item, i) => {
                return (
                  <div key={'courses-' + i} className={s.listBlock}>
                    <h2>{ item.name }</h2>
                  </div>
                )
              })
            }
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Сертифiкати')} />}
          transitionTime={200}
          open={vacancy.certificates && vacancy.certificates.length > 0}
        >
          <div className={s.mainBoxResume}>
            {
              vacancy.certificates && vacancy.certificates.map((item, i) => {
                return (
                  <div key={'certificate-' + i} className={s.listBlock}>
                    <h2>{ item.name }</h2>
                  </div>
                )
              })
            }
          </div>
        </Collapsible>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    vacancy: state.vacancy,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getVacancy,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VacancyDetail);

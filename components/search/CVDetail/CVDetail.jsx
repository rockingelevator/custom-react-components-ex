import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapsible from 'react-collapsible';
import moment from 'moment';

import { getCV } from '../../../actions/searchActions';

import Avatar from '../../common/Avatar';
import Tags from '../../forms/Tags';
import CollapseSection from '../../common/CollapseSection';

import s from '../../dashboard/ResumeContent/ResumeContent.css';


class CVDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idCode: null,
    };
  }

  componentWillMount(){
    const idCode = this.props.match.params.id;
    this.setState({idCode: idCode});
    this.props.getCV(idCode)
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
      this.props.getCV(idCode)
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
    const { cv } = this.props;

    return (
      <div className="singleBox__page">
        <div className={s.topBoxResume + ' ' + s.topBoxResume_active}>
          <div className={s.topBoxResume__header}>
            <p>{gettext('Код резюме:')}&nbsp;&nbsp;<span className={s.value}>{cv.id_code}</span></p>
            <p>{gettext('Створено:')}&nbsp;&nbsp;
              <span className={s.value}>
                {moment(cv.date_update).format("DD.MM.YYYY")}
              </span>
            </p>
          </div>

          <div>
            <div className={s.topBoxResume__content}>
              <div className={s.topBoxResume__leftPart}>
                <Avatar
                  size="large"
                  src={cv.jobseeker_photo}
                />
              </div>
              <div className={s.topBoxResume__rightPart}>
                <div className={s.topBoxResume__titlePart}>
                  <h2>{cv.jobseeker_name}</h2>
                  <p>
                    {cv.jobseeker_address}
                    {cv.jobseeker_address && cv.jobseeker_birthday && ', '}
                    {cv.jobseeker_birthday && moment().diff(cv.jobseeker_birthday, 'years') + ' роки'}
                  </p>
                  <h3>{cv.header}</h3>
                  <Tags
                      tags={this._getTagsFromList(cv.positions)}
                  />
                </div>
                {cv.salary &&
                  <div className={s.topBoxResume__sidePart}>
                    <h3>
                      <span className={s.small}>{gettext('вiд')} </span>
                      { cv.salary }
                      <span className={s.small}> {cv.currency && cv.currency.toUpperCase()}</span>
                    </h3>
                  </div>
                }
              </div>
            </div>
          </div>

        </div>
        <div className={s.mainBoxResume}>
          <div>
            <ul className='listTable'>
              <li>
                <label>{gettext('Досвiд роботи по спецiальностi:')}</label>
                <div className='listTable__value'>
                  {cv.experience_specialty && cv.experience_specialty.name}
                </div>
              </li>
              <li>
                <label>{gettext('Переваги та компетенції:')}</label>
                <div className='listTable__value'>
                  <Tags tags={this._getTagsFromList(cv.skills)}/>
                </div>
              </li>
              <li>
                <label>{gettext('Хочу працювати в:')}</label>
                <div className='listTable__value'>
                  <Tags tags={this._getTagsFromList(cv.cities)}/>
                </div>
              </li>
              <li>
                <label>{gettext('Вид зайнятості:')}</label>
                <div className='listTable__value'>
                  <Tags tags={this._getTagsFromList(cv.employment_type)}/>
                </div>
              </li>
              <li>
                <label>{gettext('Коротко про себе:')}</label>
                <div className='listTable__value'>
                  { cv.about }
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Collapsible
          trigger={<CollapseSection label={gettext('Володiння мовами')} />}
          transitionTime={200}
          open={cv.language_skills && cv.language_skills.length > 0}
        >
          <div className={s.mainBoxResume}>
            <ul className='listTable'>
              <li>
                <label>{gettext('Мови:')}</label>
                <div className='listTable__value'>
                  <Tags tags={this._getLanguageTags(cv.language_skills)}/>
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Професійний досвід')}/>}
          transitionTime={200}
          open={cv.cv_jobs && cv.cv_jobs.length > 0}
        >
          <div className={s.mainBoxResume}>
            {
              cv.cv_jobs && cv.cv_jobs.map((job, i) => {
                return (
                  <div key={'experience-' + i} className={s.listBlock}>
                    <h2>{ job.position_name }</h2>
                    <h3>{ job.company }</h3>
                    <p className={s.dates}>
                      {moment(job.start_date).format('MMMM YYYY') + ' - ' + moment(job.end_date).format('MMMM YYYY')}
                    </p>
                    <p className={s.listText}>
                      {job.responsibilitie}
                    </p>
                  </div>
                )
              })
            }
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Освіта')}/>}
          open={cv.cv_education_institutions && cv.cv_education_institutions.length > 0}
          transitionTime={200}
        >
          <div className={s.mainBoxResume}>
            {
              cv.cv_education_institutions && cv.cv_education_institutions.map((item, i) => {
                return (
                  <div key={'institution-' + i} className={s.listBlock}>
                    <h2>{ item.institution_name }</h2>
                    <h3>{ item.level }</h3>
                    <p className={s.dates}>
                      {`${item.start_year} - ${item.end_year}`}
                    </p>
                  </div>
                )
              })
            }
          </div>
        </Collapsible>

        <Collapsible
          trigger={<CollapseSection label={gettext('Курси')}/>}
          transitionTime={200}
          open={cv.cv_education_courses && cv.cv_education_courses.length > 0}
        >
          <div className={s.mainBoxResume}>
          {
            cv.cv_education_courses && cv.cv_education_courses.map((item, i) => {
              return (
                <div key={'courses-' + i} className={s.listBlock}>
                  <h2>{ item.course }</h2>
                  <p className={s.dates}>
                    {item.end_year}
                  </p>
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
    cv: state.cv,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCV,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CVDetail);

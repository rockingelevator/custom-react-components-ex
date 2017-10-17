import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchCV,
    updateCVPhoto,
    updateCVTitleBox,
    updateCVActivity,
    fetchPositions,
    fetchExperienceSpecialty,
    fetchSkills,
    fetchCities,
    fetchEmploymentTypes,
    updateCVSummaryBox,
    updateCVLanguages,
    updateCVExperience,
    updateCVEducation,
    updateCVCourses,
    updateCVCertificates,
    deleteCV,
    copyCV,
    updateCVFormErrors,
} from '../../../actions/cvActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import {
    fetchUser,
    fetchLanguageSkills,
    fetchLanguages,
    fetchLevelInstitutions,
    fetchInstitutions,
} from '../../../actions/userActions';
import Avatar from '../../common/Avatar';
import Switch from '../../forms/Switch';
import Tags from '../../forms/Tags';
import CollapseSection from '../../common/CollapseSection';
import ResumeEditTitleBox from '../ResumeEditTitleBox';
import ResumeEditSummaryBox from '../ResumeEditSummaryBox';
import Collapsible from 'react-collapsible';
import Button from '../../forms/Button';
import moment from 'moment';
import "moment/min/locales.min";
import LanguagesForm from '../ProfileLanguagesForm';
import ExperienceForm from '../ProfileExperienceForm';
import EducationForm from '../ProfileGraduationForm';
import CoursesForm from '../ProfileCoursesForm';
import CertificatesForm from '../ProfileCertificatesForm';
import ButtonWithConfirmation from '../../forms/ButtonWithConfirmation';

import s from './ResumeContent.css';

moment.locale('uk');

class ResumeContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isActiveResume: false,
            editTitleBox: false,
            editSummaryBox: false,
            editLanguagesBox: false,
            editExperienceBox: false,
            editEducationBox: false,
            editCoursesBox: false,
            editCertificatesBox: false,
            errors: {}
        };
        this._handleFormSubmit = this._handleFormSubmit.bind(this);

        this.baseUrl = '';
        if(props.match) {
          const { url } = props.match;
          let p = url.split('/');
          let path = [];
          p.map(segment => {
              if(segment != '') path.push(segment);
          });
          path.pop();
          this.baseUrl = '/' + path.join('/') + '/';
        }
    }

    componentWillMount(){
        if(this.props.match){
          const { cvId } = this.props.match.params;
          if(cvId)
              this.props.fetchCV(cvId);
        }
    }

    componentWillReceiveProps(newProps){
        const { match } = this.props;
        if(match){
          if(newProps.match.params.cvId != match.params.cvId) {
              this.props.fetchCV(newProps.match.params.cvId);
              this.setState({
                  isActiveResume: false,
                  editTitleBox: false,
                  editSummaryBox: false,
                  editLanguagesBox: false,
                  editExperienceBox: false,
                  editEducationBox: false,
                  editCoursesBox: false,
                  editCertificatesBox: false,
                  errors: {}
              });
          }
        }
    }

    _getTagsFromList(input) {
        let output = [];
        if(!input) return output;
        input.map(val => {output.push(val.name)});
        return output;
    }

    _getLanguageTags(input) {
        let output = [];
        if(!input) return output;
        input.map(val => {
           output.push(val.language_name.toLowerCase() + ' : ' + val.skill);
        });
        return output;
    }

    _handleFieldErrors(f){
        let errors = this.state.errors;
        if(f.errors.length < 1 && typeof errors[f.field] != 'undefined') {
            delete errors[f.field];
        } else if (f.errors.length != 0) {
            errors[f.field] = f.errors;
        }
        this.setState({errors});
    }

    _handleFormSubmit(form, data) {
        if(!form) return;
        let submitFunc;
        switch(form){
            case "photo":
                submitFunc = this.props.updateCVPhoto;
                break;
            case "titleBox":
                submitFunc = this.props.updateCVTitleBox;
                break;
            case "activity":
                submitFunc = this.props.updateCVActivity;
                break;
            case 'summary':
                if(data.experience_specialty) {
                    data.experience_specialty.id = data.experience_specialty.value;  // fix api that requires id in post but gives only label/value attrs in get
                }
                submitFunc = this.props.updateCVSummaryBox;
                break;
            case 'languages':
                submitFunc = this.props.updateCVLanguages;
                break;
            case 'experience':
                submitFunc = this.props.updateCVExperience;
                break;
            case 'graduation':
                submitFunc = this.props.updateCVEducation;
                break;
            case 'courses':
                submitFunc = this.props.updateCVCourses;
                break;
            case 'certificates':
                submitFunc = this.props.updateCVCertificates;
                break;
        }

        submitFunc(this.props.cv.id_code, data)
            .then(response => {
                if(response.error){
                  const errMsg = this.props.cvErrors.error_msg || gettext('Не оновлено. Перевiрте введенi данi.');
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: true,
                        text: errMsg
                    });
                } else {
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Данi оновлено.'),
                    });
                    this.props.fetchUser();
                    switch (form) {
                        case 'titleBox':
                            this.setState({editTitleBox: false});
                            break;
                        case 'summary':
                            this.setState({editSummaryBox: false});
                            break;
                        case 'languages':
                            this.setState({editLanguagesBox: false});
                            break;
                        case 'experience':
                            this.setState({editExperienceBox: false});
                            break;
                        case 'graduation':
                            this.setState({editEducationBox: false});
                            break;
                        case 'courses':
                            this.setState({editCoursesBox: false});
                            break;
                        case 'certificates':
                            this.setState({editCertificatesBox: false});
                            break;
                    }
                }
                setTimeout(() => {
                    this.props.dispatchServiceMessage({show: false});
                }, 3000);
            })
    }

    _deleteCV(){
        this.props.deleteCV(this.props.cv.id_code)
            .then(response => {
                if(!response.error){
                    this.props.history.push(this.baseUrl);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Резюме видалено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            });
    }

    _copyCV(){
        this.props.copyCV(this.props.cv.id_code)
            .then(response => {
                if(!response.error){
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id_code}`);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Копiю створено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            })
    }


    render() {
        const { match, cv, user, disableEdit } = this.props;
        const { errors } = this.state;
        const canEdit = !disableEdit && cv && user && user.role == 'jobseeker' && cv.jobseeker == user.id;
        const isActive = canEdit ? cv.is_active : cv.favorites;
        const canFav = !canEdit && user && user.role == 'employer';
        return (
            <div>

                <div className={s.topBoxResume + ' ' + (isActive ? s.topBoxResume_active : '')}>
                    <div className={s.topBoxResume__header}>
                        <p>Код резюме:&nbsp;&nbsp;<span className={s.value}>{cv.id_code}</span></p>
                        <p>Створено:&nbsp;&nbsp;
                            <span className={s.value}>
                                {moment(cv.date_created).format("DD.MM.YYYY")}
                            </span>
                        </p>
                        { canEdit &&
                          <Switch
                              label={gettext("Активно для пошуку")}
                              className={ s.resumeActivitySwitcher }
                              handleChange={is_active => { if(is_active != cv.is_active) this._handleFormSubmit('activity', {is_active})}}
                              value={cv.is_active}
                          />
                        }

                        {
                          canFav &&
                          <i
                            className={'icon-star' + (!isActive ? '-empty ' : ' ') + s.iconFav}
                            onClick={e => this.props.toggleFav('cv', cv)}
                          />
                        }
                    </div>

                    {!this.state.editTitleBox &&
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
                                        {cv.jobseeker_birthday && moment(cv.jobseeker_birthday).fromNow(true)}
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
                        {
                          canEdit &&
                          <Button
                              icon="icon-pencil"
                              className={'default_button_outline ' + s.editTitleBoxButton}
                              handleClick={e => this.setState({editTitleBox: true})}
                          />
                        }
                    </div>
                    }

                    { canEdit && this.state.editTitleBox &&
                    <div className={s.topBoxResume__content}>
                        <ResumeEditTitleBox
                            handleClose={e => {this.setState({editTitleBox: false})}}
                            data={cv}
                            errors={this.props.cvErrors}
                            handleErrors={this.props.updateCVFormErrors}
                            handleSubmit={this._handleFormSubmit}
                            fetchPositions={this.props.fetchPositions}
                        />
                    </div>
                    }

                </div>

                {
                  (canEdit ||
                    (cv.experience_specialty && cv.experience_specialty.name) ||
                    (cv.skills && cv.skills.length > 0) ||
                    (cv.cities && cv.cities.length > 0) ||
                    (cv.employment_type && cv.employment_type.length > 0) ||
                    cv.about
                  ) &&
                  <div className={s.mainBoxResume}>
                      {!this.state.editSummaryBox &&
                      <div>
                          <ul className='listTable'>
                              {
                                cv.experience_specialty && cv.experience_specialty.name &&
                                <li>
                                    <label>{gettext('Досвiд роботи по спецiальностi:')}</label>
                                    <div className='listTable__value'>
                                        {cv.experience_specialty.name}
                                    </div>
                                </li>
                              }

                              {
                                cv.skills && cv.skills.length > 0 &&
                                <li>
                                    <label>{gettext('Переваги та компетенції:')}</label>
                                    <div className='listTable__value'>
                                        <Tags tags={this._getTagsFromList(cv.skills)}/>
                                    </div>
                                </li>
                              }

                              {
                                cv.cities && cv.cities.length > 0 &&
                                <li>
                                    <label>{gettext('Хочу працювати в:')}</label>
                                    <div className='listTable__value'>
                                        <Tags tags={this._getTagsFromList(cv.cities)}/>
                                    </div>
                                </li>
                              }

                              {
                                cv.employment_type && cv.employment_type.length > 0 &&
                                <li>
                                    <label>{gettext('Вид зайнятості:')}</label>
                                    <div className='listTable__value'>
                                        <Tags tags={this._getTagsFromList(cv.employment_type)}/>
                                    </div>
                                </li>
                              }

                              {
                                cv.about &&
                                <li>
                                    <label>{gettext('Коротко про себе:')}</label>
                                    <div className='listTable__value'>
                                        { cv.about }
                                    </div>
                                </li>
                              }
                          </ul>
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => this.setState({editSummaryBox: true})}
                            />
                          }
                      </div>
                      }

                      {
                        canEdit && this.state.editSummaryBox &&
                      <ResumeEditSummaryBox
                          handleClose={e => this.setState({editSummaryBox: false})}
                          data={ cv }
                          errors={ this.props.cvErrors }
                          handleErrors={this.props.updateCVFormErrors}
                          handleSubmit={this._handleFormSubmit}
                          fetchExperienceSpecialty={this.props.fetchExperienceSpecialty}
                          fetchSkills={this.props.fetchSkills}
                          fetchCities={this.props.fetchCities}
                          fetchEmploymentTypes={this.props.fetchEmploymentTypes}
                      />
                      }
                  </div>
                }

                {
                  (canEdit || cv.language_skills && cv.language_skills.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Володiння мовами')}
                          />
                      }
                      transitionTime={200}
                      open={cv.language_skills && cv.language_skills.length > 0}
                  >
                      {!this.state.editLanguagesBox &&
                          <div className={s.mainBoxResume}>
                              <ul className='listTable'>
                                  <li>
                                      <label>Мови:</label>
                                      <div className='listTable__value'>
                                          <Tags tags={this._getLanguageTags(cv.language_skills)}/>
                                      </div>
                                  </li>
                              </ul>
                              {
                                canEdit &&
                                <Button
                                    icon="icon-pencil"
                                    className={'default_button_outline ' + s.resumeSectionEditButton}
                                    handleClick={e => {this.setState({editLanguagesBox: true})}}
                                />
                              }
                          </div>
                      }
                      {
                          canEdit && this.state.editLanguagesBox &&
                          <div className={s.mainBoxResume}>
                              <LanguagesForm
                                  user={{language_skills: cv.language_skills}}
                                  handleCancel={e => {this.setState({editLanguagesBox: false})}}
                                  languageOptions={this.props.languages}
                                  languageSkillOptions={this.props.languageSkills}
                                  fetchLanguages={this.props.fetchLanguages}
                                  fetchLanguageSkills={this.props.fetchLanguageSkills}
                                  handleSubmit={this._handleFormSubmit}
                                  errors={this.props.cvErrors}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {
                  (canEdit || cv.cv_jobs && cv.cv_jobs.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Професійний досвід')}
                          />
                      }
                      transitionTime={200}
                      open={cv.cv_jobs && cv.cv_jobs.length > 0}
                  >
                      { !this.state.editExperienceBox &&
                          <div className={s.mainBoxResume}>
                              {
                                  cv.cv_jobs && cv.cv_jobs.map((job, i) => {
                                      return (
                                          <div key={'experience-' + i} className={s.listBlock}>
                                              <h2>{ job.position_name }</h2>
                                              <h3>{ job.company }</h3>
                                              <p className={s.dates}>
                                                  {
                                                      ((job.start_date && moment(job.start_date).format('MMMM YYYY')) || gettext('дата не встановлена')) +
                                                      ' - ' +
                                                      ((job.end_date && moment(job.end_date).format('MMMM YYYY')) || gettext('дата не встановлена'))
                                                  }
                                              </p>
                                              <p className={s.listText}>
                                                  {job.responsibilitie}
                                              </p>
                                          </div>
                                      )
                                  })
                              }
                              {
                                  canEdit &&
                                  <Button
                                      icon="icon-pencil"
                                      className={'default_button_outline ' + s.resumeSectionEditButton}
                                      handleClick={e => {this.setState({editExperienceBox: true})}}
                                  />
                              }
                          </div>
                      }
                      {
                          canEdit && this.state.editExperienceBox &&
                          <div className={s.mainBoxResume}>
                                 <ExperienceForm
                                     user={{jobs: cv.cv_jobs, birthday: cv.jobseeker_birthday || user.birthday}}
                                     handleCancel={e => {this.setState({editExperienceBox: false})}}
                                     fetchPositions={this.props.fetchPositions}
                                     positionOptions={this.props.positions}
                                     errors={this.props.cvErrors}
                                     handleSubmit={this._handleFormSubmit}
                                     handleErrors={this.props.updateCVFormErrors}
                                 />
                          </div>
                      }
                  </Collapsible>
                }
                {
                  (canEdit || cv.cv_education_institutions && cv.cv_education_institutions.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Освіта')}
                          />
                      }
                      open={cv.cv_education_institutions && cv.cv_education_institutions.length > 0}
                      transitionTime={200}
                  >
                      { !this.state.editEducationBox &&
                      <div className={s.mainBoxResume}>
                          {
                              cv.cv_education_institutions && cv.cv_education_institutions.map((item, i) => {
                                  return (
                                      <div key={'institution-' + i} className={s.listBlock}>
                                          <h2>{ item.institution_name }</h2>
                                          <h3>{ item.level }</h3>
                                          <p className={s.dates}>
                                              {`${item.start_year && item.start_year || gettext('рік не встановлено')} -
                                                ${item.end_year && item.end_year || gettext('рік не встановлено')}`}
                                          </p>
                                      </div>
                                  )
                              })
                          }
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editEducationBox: true})}}
                            />
                          }
                      </div>
                      }

                      {
                          canEdit && this.state.editEducationBox &&
                          <div className={s.mainBoxResume}>
                              <EducationForm
                                  user={{education_institutions: cv.cv_education_institutions,
                                         birthday: cv.jobseeker_birthday || user.birthday}}
                                  handleSubmit={this._handleFormSubmit}
                                  handleCancel={e => { this.setState({editEducationBox: false}) }}
                                  fetchLevelInstitutions={this.props.fetchLevelInstitutions}
                                  fetchInstitutions={this.props.fetchInstitutions}
                                  levelInstitutionsOptions={this.props.levelInstitutions}
                                  institutionOptions={this.props.institutionOptions}
                                  errors={this.props.cvErrors}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {
                  (canEdit || cv.cv_education_courses && cv.cv_education_courses.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Курси')}
                          />
                      }
                      transitionTime={200}
                      open={cv.cv_education_courses && cv.cv_education_courses.length > 0}
                  >
                      {!this.state.editCoursesBox &&
                          <div className={s.mainBoxResume}>
                          {
                              cv.cv_education_courses && cv.cv_education_courses.map((item, i) => {
                                  return (
                                      <div key={'courses-' + i} className={s.listBlock}>
                                          <h2>{ item.course }</h2>
                                          <p className={s.dates}>
                                              {item.end_year && item.end_year || gettext('рік не встановлено')}
                                          </p>
                                      </div>
                                  )
                              })
                          }
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editCoursesBox: true})}}
                            />
                          }
                          </div>
                      }
                      {
                          canEdit && this.state.editCoursesBox &&
                          <div className={s.mainBoxResume}>
                              <CoursesForm
                                  user={{ education_courses: cv.cv_education_courses,
                                          birthday: cv.jobseeker_birthday || user.birthday }}
                                  handleSubmit={this._handleFormSubmit}
                                  handleCancel={e => { this.setState({editCoursesBox: false}) }}
                                  errors={this.props.cvErrors}
                                  handleErrors={this.props.updateCVFormErrors}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {
                  (canEdit || cv.cv_education_certificates && cv.cv_education_certificates.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Сертифiкати')}
                          />
                      }
                      transitionTime={200}
                      open={cv.cv_education_certificates && cv.cv_education_certificates.length > 0}
                  >
                      {!this.state.editCertificatesBox &&
                          <div className={s.mainBoxResume}>
                          {
                              cv.cv_education_certificates && cv.cv_education_certificates.map((item, i) => {
                                  return (
                                      <div key={'certificates-' + i} className={s.listBlock}>
                                          <h2>{ item.certificate }</h2>
                                          <p className={s.dates}>
                                              {item.year && item.year || gettext('рік не встановлено')}
                                          </p>
                                      </div>
                                  )
                              })
                          }
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editCertificatesBox: true})}}
                            />
                          }
                          </div>
                      }
                      {
                          canEdit && this.state.editCertificatesBox &&
                          <div className={s.mainBoxResume}>
                              <CertificatesForm
                                  user={{ education_certificates: cv.cv_education_certificates,
                                          birthday: cv.jobseeker_birthday || user.birthday }}
                                  handleSubmit={this._handleFormSubmit}
                                  handleCancel={e => { this.setState({editCertificatesBox: false}) }}
                                  errors={this.props.cvErrors}
                                  handleErrors={this.props.updateCVFormErrors}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {
                  canEdit &&
                  <div className={s.resumeFooter}>
                      <ButtonWithConfirmation
                          label={gettext('Видалити')}
                          buttonClassName='default_button_outline'
                          handleClick={this._deleteCV.bind(this)}
                      />
                      <Button
                          label={gettext('Створити копiю')}
                          className='default_button_outline'
                          handleClick={this._copyCV.bind(this)}
                      />
                  </div>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUser,
        dispatchServiceMessage,
        fetchCV,
        updateCVPhoto,
        updateCVTitleBox,
        updateCVActivity,
        fetchPositions,
        fetchExperienceSpecialty,
        fetchSkills,
        fetchCities,
        fetchEmploymentTypes,
        updateCVSummaryBox,
        fetchLanguageSkills,
        fetchLanguages,
        updateCVLanguages,
        updateCVExperience,
        fetchLevelInstitutions,
        fetchInstitutions,
        updateCVEducation,
        updateCVCourses,
        updateCVCertificates,
        deleteCV,
        copyCV,
        updateCVFormErrors,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        cv: state.cv,
        languages: state.languages,
        languageSkills: state.languageSkills,
        cvErrors: state.cvErrors,
        positions: state.positions,
        levelInstitutions: state.levelInstitutions,
        institutionOptions: state.institutions
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumeContent);

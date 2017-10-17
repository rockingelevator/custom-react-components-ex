import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchVacancy,
    updateVacancyActivity,
    deleteVacancy,
    copyVacancy,
    fetchScopeActivity,
    updateVacancyTitleBox,
    updateVacancyLogo,
    updateVacancyLanguages,
    updateVacancyAbout,
    updateVacancySkills,
    updateVacancyCourses,
    updateVacancyCertificates,
    updateVacancyConditions,
    fetchTimeSchedules,
    fetchAdvantages,
    updateVacancyFormErrors,
} from '../../../actions/vacancyActions';
import {
    fetchPositions,
    fetchExperienceSpecialty,
    fetchSkills,
    fetchCities,
    fetchEmploymentTypes,
} from '../../../actions/cvActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import {
    fetchUser,
    fetchLanguageSkills,
    fetchLanguages,
    fetchEducationLevels,
    fetchInstitutions,
} from '../../../actions/userActions';

import { updateBreadcrumbs } from '../../../actions/commonActions';

import Avatar from '../../common/Avatar';
import Switch from '../../forms/Switch';
import Tags from '../../forms/Tags';
import CollapseSection from '../../common/CollapseSection';
import Collapsible from 'react-collapsible';
import Button from '../../forms/Button';
import moment from 'moment';
import LanguagesForm from '../ProfileLanguagesForm';
import CoursesForm from '../ProfileCoursesForm';
import ButtonWithConfirmation from '../../forms/ButtonWithConfirmation';
import EditTitleBox from '../VacancyEditTitleBox';
import VacancyEditAboutForm from '../VacancyEditAboutForm';
import VacancyEditSkillsForm from '../VacancyEditSkillsForm';
import CertificatesForm from '../ProfileCertificatesForm';
import VacancyEditConditionsForm from '../VacancyEditConditionsForm';

import s from '../ResumeContent/ResumeContent.css';


class VacancyContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isActiveResume: false,
            editTitleBox: false,
            editAboutBox: false,
            editSkillsBox: false,
            editLanguagesBox: false,
            editCoursesBox: false,
            editCertificatesBox: false,
            editConditionsBox: false,
            errors: {},
            mustSkills: [],
            otherSkills: []
        };
        this._handleFormSubmit = this._handleFormSubmit.bind(this);


        if(!props.match){
          this.baseUrl = '';
          return;
        }

        const { url } = props.match;
        let p = url.split('/');
        let path = [];
        p.map(segment => {
            if(segment != '') path.push(segment);
        });
        path.pop();
        this.baseUrl = '/' + path.join('/') + '/';
    }

    componentWillMount(){
        if(!this.props.match) return;
        const { vacancyId } = this.props.match.params;
        if(vacancyId)
            this.props.fetchVacancy(vacancyId);
    }

    componentWillReceiveProps(newProps){
        const { match } = this.props;

        if(!match) return;

        if(newProps.match.params.vacancyId != match.params.vacancyId) {
            this.props.fetchVacancy(newProps.match.params.vacancyId);
            this.setState({
                isActiveResume: false,
                editTitleBox: false,
                editAboutBox: false,
                editSkillsBox: false,
                editLanguagesBox: false,
                editCoursesBox: false,
                editCertificatesBox: false,
                editConditionsBox: false
            });
        }
        let mustSkills = [];
        let otherSkills = [];
        if(newProps.vacancy && newProps.vacancy.skills) {
            newProps.vacancy.skills.map(skill => {
                if(skill.is_must) {
                    mustSkills.push(skill);
                } else {
                    otherSkills.push(skill);
                }
            });
            this.setState({mustSkills, otherSkills});
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
            case "activity":
                submitFunc = this.props.updateVacancyActivity;
                break;

            case "titleBox":
                submitFunc = this.props.updateVacancyTitleBox;
                break;

            case "logo":
                submitFunc = this.props.updateVacancyLogo;
                break;

            case "about":
                submitFunc = this.props.updateVacancyAbout;
                break;

            case "languages":
                data.map(l => {
                   l.is_must = true;
                });
                submitFunc = this.props.updateVacancyLanguages;
                break;

            case "skills":
                submitFunc = this.props.updateVacancySkills;
                break;

            case "courses":
                submitFunc = this.props.updateVacancyCourses;
                data.map(c => {
                    c.name = c.name || c.course;
                    c.is_must = true;
                });
                break;

            case "certificates":
                submitFunc = this.props.updateVacancyCertificates;
                data.map(c => {
                    c.name = c.name || c.certificate;
                    c.is_must = true;
                });
                break;

            case "conditions":
                submitFunc = this.props.updateVacancyConditions;
                break;
        }

        submitFunc(this.props.vacancy.id_code, data)
            .then(response => {
                if(response.error){
                    const errMsg = this.props.vacancyErrors.error_msg || gettext('Не оновлено. Перевiрте введенi данi.');
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

                        case 'about':
                            this.setState({editAboutBox: false});
                            break;

                        case 'languages':
                            this.setState({editLanguagesBox: false});
                            break;

                        case 'skills':
                            this.setState({editSkillsBox: false});
                            break;

                        case 'courses':
                            this.setState({editCoursesBox: false});
                            break;

                        case 'certificates':
                            this.setState({editCertificatesBox: false});
                            break;

                        case 'conditions':
                            this.setState({editConditionsBox: false});
                            break;
                    }
                }
                setTimeout(() => {
                    this.props.dispatchServiceMessage({show: false});
                }, 4000);
            })
    }

    _deleteVacancy(){
        this.props.deleteVacancy(this.props.vacancy.id_code)
            .then(response => {
                if(!response.error){
                    this.props.history.push(this.baseUrl);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Вакансію видалено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            });
    }

    _copyVacancy(){
        this.props.copyVacancy(this.props.vacancy.id_code)
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
        const { match, vacancy, user, disableEdit } = this.props;
        const { errors } = this.state;
        const canEdit = !disableEdit && vacancy && vacancy.employer && user && user.role == 'employer' && vacancy.employer == user.id;
        const isActive = canEdit ? vacancy.is_active : vacancy.favorites;
        const canFav = !canEdit && user && user.role == 'jobseeker';

        return (
            <div>
                <div className={s.topBoxResume + ' ' + (isActive ? s.topBoxResume_active : '')}>
                    <div className={s.topBoxResume__header}>
                        <p>Код ваканії:&nbsp;&nbsp;<span className={s.value}>{vacancy.id_code}</span></p>
                        <p>Створено:&nbsp;&nbsp;
                            <span className={s.value}>
                                {moment(vacancy.date_created).format("DD.MM.YYYY")}
                            </span>
                        </p>
                        {
                          canEdit &&
                          <Switch
                              label="Активно для пошуку"
                              className={ s.resumeActivitySwitcher }
                              handleChange={is_active => { if(is_active != vacancy.is_active) this._handleFormSubmit('activity', {is_active})}}
                              value={vacancy.is_active}
                          />
                        }
                        {
                          canFav &&
                          <i
                            className={'icon-star' + (!isActive ? '-empty ' : ' ') + s.iconFav}
                            onClick={e => this.props.toggleFav('vacancy', vacancy)}
                          />
                        }
                        {/*
                            this.props.vacancyErrors.error_msg &&
                            <ul className="errorList">
                                <li>{this.props.vacancyErrors.error_msg}</li>
                            </ul>
                        */}
                    </div>

                    {!this.state.editTitleBox &&
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

                    {canEdit && this.state.editTitleBox &&
                    <div className={s.topBoxResume__content}>
                        <EditTitleBox
                            handleClose={e => {this.setState({editTitleBox: false})}}
                            data={vacancy}
                            errors={this.props.vacancyErrors}
                            handleErrors={this.props.updateVacancyFormErrors}
                            handleSubmit={this._handleFormSubmit}
                            fetchScopeActivityOptions={this.props.fetchScopeActivity}
                        />
                    </div>
                    }
                </div>

                {/* ABOUT VACANCY SECTION */}
                { (canEdit ||
                  vacancy.about ||
                  vacancy.description ||
                  vacancy.about_company
                  ) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Про вакансію')}
                          />
                      }
                      transitionTime={200}
                      open={true}
                  >
                      {!this.state.editAboutBox &&
                      <div className={s.mainBoxResume}>
                          <ul className='listTable'>
                              {
                                vacancy.about &&
                                <li>
                                    <label>{gettext('Опис вакансії:')}</label>
                                    <div className='listTable__value'>
                                        {vacancy.about}
                                    </div>
                                </li>
                              }
                              {
                                vacancy.description &&
                                <li>
                                    <label>{gettext("Обов'язки:")}</label>
                                    <div className='listTable__value'>
                                        {vacancy.description}
                                    </div>
                                </li>
                              }
                              {
                                vacancy.about_company &&
                                <li>
                                    <label>{gettext('Про компанію:')}</label>
                                    <div className='listTable__value'>
                                        {vacancy.about_company}
                                    </div>
                                </li>
                              }
                          </ul>
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editAboutBox: true})}}
                            />
                          }
                      </div>
                      }
                      {
                          canEdit && this.state.editAboutBox &&
                          <div className={s.mainBoxResume}>
                              <VacancyEditAboutForm
                                  data={vacancy}
                                  handleClose={e => this.setState({editAboutBox: false})}
                                  errors={this.props.vacancyErrors}
                                  handleErrors={this.props.updateVacancyFormErrors}
                                  handleSubmit={this._handleFormSubmit}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {/* SKILLS SECTION */}
                {
                  (canEdit ||
                    (vacancy.education_levels && vacancy.education_levels.length > 0) ||
                    (vacancy.experience_specialty && vacancy.experience_specialty.length > 0) ||
                    (this.state.mustSkills && this.state.mustSkills.length > 0) ||
                    (this.state.otherSkills && this.state.otherSkills.length > 0)
                  ) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Компетенції')}
                          />
                      }
                      transitionTime={200}
                      open={true}
                  >
                      {!this.state.editSkillsBox &&
                      <div className={s.mainBoxResume}>
                          <ul className='listTable'>

                              {
                                vacancy.education_levels && vacancy.education_levels.length > 0 &&
                                <li>
                                    <label>{gettext('Освіта:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(vacancy.education_levels)}
                                        />
                                    </div>
                                </li>
                              }

                              {
                                vacancy.experience_specialty && vacancy.experience_specialty.length > 0 &&
                                <li>
                                    <label>{gettext('Досвід:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(vacancy.experience_specialty)}
                                        />
                                    </div>
                                </li>
                              }

                              {
                                this.state.mustSkills && this.state.mustSkills.length > 0 &&
                                <li>
                                    <label>{gettext('Ключові компетенціі:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(this.state.mustSkills)}
                                        />
                                    </div>
                                </li>
                              }

                              {
                                this.state.otherSkills && this.state.otherSkills.length > 0 &&
                                <li>
                                    <label>{gettext('Бажані компетенціі:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(this.state.otherSkills)}
                                        />
                                    </div>
                                </li>
                              }
                          </ul>
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editSkillsBox: true})}}
                            />
                          }
                      </div>
                      }
                      {
                          canEdit && this.state.editSkillsBox &&
                          <div className={s.mainBoxResume}>
                              <VacancyEditSkillsForm
                                  data={ vacancy }
                                  fetchEducationLevelsOptions={this.props.fetchEducationLevels}
                                  fetchExperienceSpecialtyOptions={this.props.fetchExperienceSpecialty }
                                  handleCancel={e => {this.setState({editSkillsBox: false})}}
                                  handleSubmit={this._handleFormSubmit}
                                  errors={this.props.vacancyErrors}
                                  fetchSkillsOptions={this.props.fetchSkills}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                {
                  (canEdit ||
                    (vacancy.employment_type && vacancy.employment_type.length > 0) ||
                    (vacancy.time_schedules && vacancy.time_schedules.length > 0) ||
                    vacancy.working_conditions ||
                    (vacancy.advantages && vacancy.advantages.length > 0)
                  ) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Умови')}
                          />
                      }
                      transitionTime={200}
                      open={true}
                  >
                      {!this.state.editConditionsBox &&
                      <div className={s.mainBoxResume}>
                          <ul className='listTable'>
                              {
                                vacancy.employment_type && vacancy.employment_type.length > 0 &&
                                <li>
                                    <label>{gettext('Вид зайнятостi:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(vacancy.employment_type)}
                                        />
                                    </div>
                                </li>
                              }

                              {
                                vacancy.time_schedules && vacancy.time_schedules.length > 0 &&
                                <li>
                                    <label>{gettext('Графiк:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(vacancy.time_schedules)}
                                        />
                                    </div>
                                </li>
                              }

                              {
                                vacancy.working_conditions &&
                                <li>
                                    <label>{gettext('Умови:')}</label>
                                    <div className='listTable__value'>
                                        {vacancy.working_conditions}
                                    </div>
                                </li>
                              }

                              {
                                vacancy.advantages && vacancy.advantages.length > 0 &&
                                <li>
                                    <label>{gettext('Переваги:')}</label>
                                    <div className='listTable__value'>
                                        <Tags
                                            tags={this._getTagsFromList(vacancy.advantages)}
                                        />
                                    </div>
                                </li>
                              }
                          </ul>
                          {
                            canEdit &&
                            <Button
                                icon="icon-pencil"
                                className={'default_button_outline ' + s.resumeSectionEditButton}
                                handleClick={e => {this.setState({editConditionsBox: true})}}
                            />
                          }
                      </div>
                      }
                      {
                          canEdit && this.state.editConditionsBox &&
                          <div className={s.mainBoxResume}>
                              <VacancyEditConditionsForm
                                  data={ vacancy }
                                  handleCancel={e => {this.setState({editConditionsBox: false})}}
                                  handleSubmit={this._handleFormSubmit}
                                  errors={this.props.vacancyErrors}
                                  fetchEmploymentTypeOptions={this.props.fetchEmploymentTypes}
                                  fetchTimeScheduleOptions={this.props.fetchTimeSchedules}
                                  fetchAdvantageOptions={this.props.fetchAdvantages}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                { (canEdit || vacancy.language_skills && vacancy.language_skills.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Володiння мовами')}
                          />
                      }
                      transitionTime={200}
                      open={vacancy.language_skills && vacancy.language_skills.length > 0}
                  >
                      {!this.state.editLanguagesBox &&
                      <div className={s.mainBoxResume}>
                          <ul className='listTable'>
                              <li>
                                  <label>{gettext('Мови:')}</label>
                                  <div className='listTable__value'>
                                      <Tags tags={this._getLanguageTags(vacancy.language_skills)}/>
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
                                  user={{language_skills: vacancy.language_skills}}
                                  handleCancel={e => {this.setState({editLanguagesBox: false})}}
                                  languageOptions={this.props.languages}
                                  languageSkillOptions={this.props.languageSkills}
                                  fetchLanguages={this.props.fetchLanguages}
                                  fetchLanguageSkills={this.props.fetchLanguageSkills}
                                  handleSubmit={this._handleFormSubmit}
                                  errors={this.props.vacancyErrors}
                              />
                          </div>
                      }
                  </Collapsible>
                }

                { (canEdit || vacancy.courses && vacancy.courses.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Курси')}
                          />
                      }
                      transitionTime={200}
                      open={vacancy.courses && vacancy.courses.length > 0}
                  >
                      {!this.state.editCoursesBox &&
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
                                  user={{ education_courses: vacancy.courses }}
                                  handleSubmit={this._handleFormSubmit}
                                  hideDate
                                  errors={this.props.vacancyErrors}
                                  handleCancel={e => { this.setState({editCoursesBox: false}) }}
                              />
                          </div>
                      }
                  </Collapsible>
                }


                { (canEdit || vacancy.certificates && vacancy.certificates.length > 0) &&
                  <Collapsible
                      trigger={
                          <CollapseSection
                              label={gettext('Сертифiкати')}
                          />
                      }
                      transitionTime={200}
                      open={vacancy.certificates && vacancy.certificates.length > 0}
                  >
                      {!this.state.editCertificatesBox &&
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
                                  user={{ education_certificates: vacancy.certificates }}
                                  handleSubmit={this._handleFormSubmit.bind(this)}
                                  handleCancel={e => { this.setState({editCertificatesBox: false}) }}
                                  errors={this.props.vacancyErrors}
                                  hideDates
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
                          handleClick={this._deleteVacancy.bind(this)}
                      />
                      <Button
                          label={gettext('Створити копiю')}
                          className='default_button_outline'
                          handleClick={this._copyVacancy.bind(this)}
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
        fetchVacancy,
        deleteVacancy,
        copyVacancy,
        updateVacancyActivity,
        fetchPositions,
        fetchExperienceSpecialty,
        fetchSkills,
        fetchCities,
        fetchEmploymentTypes,
        fetchLanguageSkills,
        fetchLanguages,
        fetchEducationLevels,
        fetchInstitutions,
        fetchScopeActivity,
        updateVacancyTitleBox,
        updateVacancyLogo,
        updateVacancyLanguages,
        updateVacancyAbout,
        updateVacancySkills,
        updateVacancyCourses,
        updateVacancyCertificates,
        updateVacancyConditions,
        fetchTimeSchedules,
        fetchAdvantages,
        updateBreadcrumbs,
        updateVacancyFormErrors,
    }, dispatch);
}

function mapStateTopProps(state) {
    return {
        user: state.user,
        vacancy: state.vacancy,
        languages: state.languages,
        languageSkills: state.languageSkills,
        vacancyErrors: state.vacancyErrors,
        breadcrumbs: state.breadcrumbs
    };
}

export default connect(mapStateTopProps, mapDispatchToProps)(VacancyContent);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchUser,
  updateUserInfo,
  updateUserEmail,
  updateUserAddress,
  updateUserSocial,
  updateUserMessangers,
  updateUserPhoto,
  updateUserLanguages,
  updateUserExperience,
  updateUserGraduation,
  updateUserCourses,
  updateUserCertificates,
  fetchLanguages,
  fetchLanguageSkills,
  fetchPositions,
  fetchLevelInstitutions,
  fetchInstitutions,
  updateProfileFormErrors,
} from '../../../actions/userActions';
import {
  dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import {
  updateBreadcrumbs
} from '../../../actions/commonActions';
import { Route } from 'react-router';
import s from './Profile.css';
import DashboardContent from '../DashboardContent';
import ProfileInfoForm from '../ProfileInfoForm';
import ProfileEmailForm from '../ProfileEmailForm';
import ProfileAddressForm from '../ProfileAddressForm';
import ProfileSocialForm from '../ProfileSocialForm';
import ProfileMessangerForm from '../ProfileMessangerForm';
import ProfileLanguagesForm from '../ProfileLanguagesForm';
import ProfileExperienceForm from '../ProfileExperienceForm';
import ProfileGraduationForm from '../ProfileGraduationForm';
import ProfileCoursesForm from '../ProfileCoursesForm';
import ProfileCertificatesForm from '../ProfileCertificatesForm';
import SubNavigation from '../SubNavigation';
import SubNavigationItem from '../SubNavigationItem';
import FormStatus from '../../forms/FormStatus';

const forms = [
  {name: 'info', path: ''},
  {name: 'email', path: 'email'},
  {name: 'address', path: 'address'},
  {name: 'social', path: 'social'},
  {name: 'messangers', path: 'messangers'},
  {name: 'languages', path: 'languages'},
  {name: 'experience', path: 'experience'},
  {name: 'graduation', path: 'graduation'},
  {name: 'courses', path: 'courses'},
  {name: 'certificates', path: 'certificates'},
];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingUser: false,
      fetchingUpdate: false,
      fetchingUserpic: false,
      updateStatus: null,
      formTitle: '',
    }
    const { match } = this.props;
    this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
  }

  componentWillMount(){
    this.props.updateBreadcrumbs([
      {
        link: '/dashboard/profile/',
        label: 'Мій профайл'
      },
      {
        link: '/dashboard/profile/edit/',
        label: 'Редагуванная профайлу'
      }
    ])
  }

  componentDidMount(){
    this.props.history.listen( location =>  {
      // settins default status message when routes change
      this.setState({updateStatus: null});
    });
  }

  _handleFormInit(formTitle) {
    this.setState({formTitle});
    this.props.dispatchServiceMessage({show:false});
  }

  _handleFormSubmit(form, data) {
    this.setState({fetchingUpdate: true});
    const {
      user,
      updateUserInfo,
      updateUserAddress,
      updateUserEmail,
      updateUserSocial,
      updateUserMessangers,
      updateUserPhoto,
      updateUserLanguages,
      updateUserExperience,
      updateUserGraduation,
      updateUserCourses,
      updateUserCertificates
    } = this.props;
    let submitFunc;
    switch(form){
      case 'address':
        submitFunc = updateUserAddress;
        break;
      case 'email':
        submitFunc = updateUserEmail;
        break;
      case 'social':
        submitFunc = updateUserSocial;
        break;
      case 'messangers':
        submitFunc = updateUserMessangers;
        break;
      case 'photo':
        submitFunc = updateUserPhoto;
        break;
      case 'languages':
        submitFunc = updateUserLanguages;
        break;
      case 'experience':
        submitFunc = updateUserExperience;
        break;
      case 'graduation':
        submitFunc = updateUserGraduation;
        break;
      case 'courses':
        submitFunc = updateUserCourses;
        break;
      case 'certificates':
        submitFunc = updateUserCertificates;
        break;
      default:
        submitFunc = updateUserInfo;
    }
    submitFunc(user.id, data)
      .then(response => {
        if(response.error){
          this.setState({
            fetchingUpdate: false,
            // updateStatus: {
            //   error: true,
            //   statusMessage: 'Профiль не оновлено. Перевiрте введенi данi'
            // }
          });
          this.props.dispatchServiceMessage({
            show: true,
            error: true,
            text: gettext('Профiль не оновлено. Перевiрте введенi данi.')
          });
          setTimeout(()=>{
            this.props.dispatchServiceMessage({show: false});
          }, 2000);
        } else {
          this.setState({
            fetchingUpdate: false,
            // updateStatus: {
            //   error: false,
            //   statusMessage: 'Профiль оновлено'
            // }
          });
          // find next form to edit
          let goNext;
          forms.map((f, i) => {
            if(f.name == form){
              const nextForm = i + 1 >= forms.length ? 0 : forms[i+1];
              if (nextForm)
                goNext=`${this.baseUrl}${nextForm.path}`;
            }
          });
          this.props.dispatchServiceMessage({
            show: true,
            error: false,
            text: gettext('Профiль оновлено.'),
            goNext,
            buttonLabel: gettext('Додати ще iнформацiю')
          });
        }
      }).catch(error => {
        console.log(error);
      });
  }

  render(){
    const { match, user, breadcrumbs } = this.props;


    return (
    <div className="dashboardContentWrapper">
      <div className="dashboardContentWrapper__row">

          {/*CENTRAL CONTENT*/}

          <DashboardContent title={this.state.formTitle} breadcrumbs={breadcrumbs} twoColumns>
            <div className='formWrapper'>
              <Route
                  path={ this.baseUrl }
                  exact
                  render={() => {
                      return (
                          <ProfileInfoForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}email/` }
                  exact
                  render={() => {
                      return (
                          <ProfileEmailForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}address/` }
                  exact
                  render={() => {
                      return (
                          <ProfileAddressForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}social/` }
                  exact
                  render={() => {
                      return (
                          <ProfileSocialForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}messangers/` }
                  exact
                  render={() => {
                      return (
                          <ProfileMessangerForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}languages/` }
                  exact
                  render={() => {
                      return (
                          <ProfileLanguagesForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              fetchLanguages={this.props.fetchLanguages}
                              fetchLanguageSkills={this.props.fetchLanguageSkills}
                              languageOptions={this.props.languages}
                              languageSkillOptions={this.props.languageSkills}
                              errors={this.props.profileErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}experience/` }
                  exact
                  render={() => {
                      return (
                          <ProfileExperienceForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              fetchPositions={this.props.fetchPositions}
                              positionOptions={this.props.positions}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}graduation/` }
                  exact
                  render={() => {
                      return (
                          <ProfileGraduationForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              fetchLevelInstitutions={this.props.fetchLevelInstitutions}
                              fetchInstitutions={this.props.fetchInstitutions}
                              levelInstitutionsOptions={this.props.levelInstitutions}
                              institutionOptions={this.props.institutionOptions}
                              errors={this.props.profileErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}courses/` }
                  exact
                  render={() => {
                      return (
                          <ProfileCoursesForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

              <Route
                  path={ `${this.baseUrl}certificates/` }
                  exact
                  render={() => {
                      return (
                          <ProfileCertificatesForm
                              user={user}
                              handleFormInit={this._handleFormInit.bind(this)}
                              handleSubmit={this._handleFormSubmit.bind(this)}
                              fetching={this.state.fetchingUpdate}
                              errors={this.props.profileErrors}
                              handleErrors={this.props.updateProfileFormErrors}
                          />
                      )
                  }}
              />

                {this.state.updateStatus &&
                <FormStatus
                    error={this.state.updateStatus.error}
                    message={this.state.updateStatus.statusMessage}
                />
                }
            </div>
          </DashboardContent>

          {/*RIGHT SIDEPANEL*/}

        <div className="dashboardSidePanel sidepanel sidepanel_right">
          <SubNavigation>
            <SubNavigationItem label={gettext('Основна iнформацiя')} path={ this.baseUrl }/>
            <SubNavigationItem label={gettext('Електронна пошта')} path={`${this.baseUrl}email/`} />
            <SubNavigationItem label={gettext('Адреса')} path={`${this.baseUrl}address/`} />
            <SubNavigationItem label={gettext('Соцiaльнi мережi')} path={`${this.baseUrl}social/`} />
            <SubNavigationItem label={gettext('Месенджери')} path={`${this.baseUrl}messangers/`} />
            <SubNavigationItem label={gettext('Володiння мовами')} path={`${this.baseUrl}languages/`} />
            <SubNavigationItem label={gettext('Професiйний досвiд')} path={`${this.baseUrl}experience/`} />
            <SubNavigationItem label={gettext('Освiта')} path={`${this.baseUrl}graduation/`} />
            <SubNavigationItem label={gettext('Курси')} path={`${this.baseUrl}courses/`} />
            <SubNavigationItem label={gettext('Сертифiкати')} path={`${this.baseUrl}certificates/`} />
          </SubNavigation>
        </div>
      </div>
    </div>
    );
  }
}

const mapPropsToState = (state) => {
  return {
    user: state.user,
    profileErrors: state.profileErrors,
    languages: state.languages,
    languageSkills: state.languageSkills,
    positions: state.positions,
    levelInstitutions: state.levelInstitutions,
    institutionOptions: state.institutions,
    breadcrumbs: state.breadcrumbs
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchUser,
    updateUserInfo,
    updateUserAddress,
    updateUserEmail,
    updateUserSocial,
    updateUserMessangers,
    updateUserPhoto,
    updateUserLanguages,
    updateUserExperience,
    updateUserGraduation,
    updateUserCourses,
    updateUserCertificates,
    fetchLanguages,
    fetchLanguageSkills,
    fetchPositions,
    fetchLevelInstitutions,
    fetchInstitutions,
    dispatchServiceMessage,
    updateBreadcrumbs,
    updateProfileFormErrors,
  }, dispatch);
};

export default connect(mapPropsToState, mapDispatchToProps)(Profile);

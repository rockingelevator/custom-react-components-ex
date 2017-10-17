import * as types from './actionTypes.jsx';


export function fetchUser() {
    return {
        type: types.FETCH_USER,
        payload: {
            request: {
                url: `api/current_profile/`,
                method: "get"
            }
        }
    };
}


export function updateUserInfo(id, data) {
    return {
        type: types.UPDATE_USER_INFO,
        payload: {
            request: {
                url: `api/jobseekers/${id}/`,
                method: "put",
                data
            }
        }
    };
}

export function updateUserAddress(id, data) {
    return {
        type: types.UPDATE_USER_ADDRESS,
        payload: {
            request: {
                url: `api/jobseekers/${id}/set_address/`,
                method: "post",
                data
            }
        }
    };
}

export function updateUserEmail(id, data) {
    return {
        type: types.UPDATE_USER_EMAIL,
        payload: {
            request: {
                url: `api/jobseekers/${id}/set_email/`,
                method: "post",
                data
            }
        }
    };
}

export function loginUser(data) {
    return {
        type: types.LOGIN_USER,
        payload: {
            request: {
                url: 'login/email/',
                method: "post",
                data
            }
        }
    };
}

export function registrationUser(data) {
    return {
        type: types.REGISTRATION_USER,
        payload: {
            request: {
                url: 'registration/email/',
                method: "post",
                data
            }
        }
    };
}

export function passwordReset(data) {
    return {
        type: types.PASSWORD_RESET_USER,
        payload: {
            request: {
                url: 'password_reset/',
                method: "post",
                data
            }
        }
    };
}

export function newPasswordSave(uid, token, data) {
    return {
        type: types.NEW_PASSWORD_SAVE_USER,
        payload: {
            request: {
                url: `reset/${uid}/${token}/`,
                method: "post",
                data
            }
        }
    };
}

export function updateUserSocial(id, data) {
    return {
        type: types.UPDATE_USER_SOCIAL,
        payload: {
            request: {
                url: `api/jobseekers/${id}/set_social_networks/`,
                method: "post",
                data
            }
        }
    };
}

export function updateUserMessangers(id, data) {
    return {
        type: types.UPDATE_USER_MESSANGERS,
        payload: {
            request: {
                url: `api/jobseekers/${id}/set_messengers/`,
                method: "post",
                data
            }
        }
    };
}

export function updateUserPhoto(id, data) {
  return {
      type: types.UPDATE_USER_PHOTO,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_photo/`,
              method: "post",
              data
          }
      }
  };
}

export function updateUserLanguages(id, data) {
  return {
      type: types.UPDATE_USER_LANGUAGES,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_language_skills/`,
              method: "post",
              data
          }
      }
  };
}

export function updateUserExperience(id, data) {
  return {
      type: types.UPDATE_USER_EXPERIENCE,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_jobs/`,
              method: "post",
              data
          }
      }
  };
}

export function updateUserGraduation(id, data) {
  return {
      type: types.UPDATE_USER_GRADUATION,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_institutions/`,
              method: "post",
              data
          }
      }
  };
}

export function updateUserCourses(id, data) {
  return {
      type: types.UPDATE_USER_COURSES,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_courses/`,
              method: "post",
              data
          }
      }
  };
}

export function updateUserCertificates(id, data) {
  return {
      type: types.UPDATE_USER_CERTIFICATES,
      payload: {
          request: {
              url: `api/jobseekers/${id}/set_certificates/`,
              method: "post",
              data
          }
      }
  };
}

export function confirmUserPhone(id, data) {
  return {
      type: types.CONFIRM_USER_PHONE,
      payload: {
          request: {
              url: `api/jobseekers/${id}/confirm_phone/`,
              method: "post",
              data
          }
      }
  };
}

export function confirmUserPinCode(id, data) {
  return {
      type: types.CONFIRM_USER_PIN_CODE,
      payload: {
          request: {
              url: `api/jobseekers/${id}/confirm_pin_code/`,
              method: "post",
              data
          }
      }
  };
}

export function fetchLanguages(query='') {
  return {
      type: types.FETCH_LANGUAGES,
      payload: {
          request: {
              url: `api/languages/`,
              method: "get",
          }
      }
  };
}

export function fetchLanguageSkills() {
  return {
      type: types.FETCH_LANGUAGE_SKILLS,
      payload: {
          request: {
              url: `api/language_skill_options/`,
              method: "get",
          }
      }
  };
}

export function fetchPositions() {
  return {
      type: types.FETCH_POSITIONS,
      payload: {
          request: {
              url: `api/positions/`,
              method: "get",
          }
      }
  };
}

export function fetchLevelInstitutions() {
  return {
      type: types.FETCH_LEVEL_INSTITUTIONS,
      payload: {
          request: {
              url: `api/level_institutions/`,
              method: "get",
          }
      }
  };
}

export function fetchInstitutions() {
  return {
      type: types.FETCH_INSTITUTIONS,
      payload: {
          request: {
              url: `api/institutions/`,
              method: "get",
          }
      }
  };
}

export function fetchEducationLevels() {
  return {
      type: types.FETCH_EDUCATION_LEVELS,
      payload: {
          request: {
              url: `api/education_level_options/`,
              method: "get",
          }
      }
  };
}

export function updateProfileFormErrors(errors) {
  return {
    type: types.UPDATE_PROFILE_FORM_ERRORS,
    payload: {
      errors
    }
  }
}

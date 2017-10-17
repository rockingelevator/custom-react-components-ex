import * as types from './actionsTypes_cv';

export function fetchMyCVs() {
    return {
        type: types.FETCH_MY_CVS,
        payload: {
            request: {
                url: 'api/cv/',
                method: 'get'
            }
        }
    };
}

export function fetchCV(id) {
    return {
        type: types.FETCH_CV,
        payload: {
            request: {
                url: `api/cv/${id}/`,
                method: 'get'
            }
        }
    };
}

export function updateCVPhoto(id, data) {
    return {
        type: types.UPDATE_CV_PHOTO,
        payload: {
            request: {
                url: `api/cv/${id}/set_photo/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function updateCVTitleBox(id, data) {
    return {
        type: types.UPDATE_CV_TITLEBOX,
        payload: {
            request: {
                url: `api/cv/${id}/set_info_title/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function updateCVActivity(id, data) {
    return {
        type: types.UPDATE_CV_ACTIVITY,
        payload: {
            request: {
                url: `api/cv/${id}/set_publish/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function fetchPositions(query='') {
    return {
        type: types.FETCH_POSITIONS,
        payload: {
            request: {
                url: `api/positions/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchExperienceSpecialty(){
    return {
        type: types.FETCH_EXPERIENCE_SPECIALTY,
        payload: {
            request: {
                url: `api/experience_specialty_options/`,
                method: 'get',
            }
        }
    };
}

export function fetchSkills(query) {
    return {
        type: types.FETCH_SKILLS,
        payload: {
            request: {
                url: `api/skill_options/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchCities(query='') {
    return {
        type: types.FETCH_CITIES,
        payload: {
            request: {
                url: `api/city_options/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchEmploymentTypes(){
    return {
        type: types.FETCH_EMPLOYMENT_TYPES,
        payload: {
            request: {
                url: `api/employment_type_options/`,
                method: 'get',
            }
        }
    };
}

export function updateCVSummaryBox(id, data) {
    return {
        type: types.UPDATE_SUMMARYBOX,
        payload: {
            request: {
                url: `api/cv/${id}/set_info_summary/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVLanguages(id, data) {
    return {
        type: types.UPDATE_CV_LANGUAGES,
        payload: {
            request: {
                url: `api/cv/${id}/set_cv_language_skills/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVExperience(id, data) {
    return {
        type: types.UPDATE_CV_EXPERIENCE,
        payload: {
            request: {
                url: `api/cv/${id}/set_cv_jobs/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVEducation(id, data) {
    return {
        type: types.UPDATE_CV_EDUCATION,
        payload: {
            request: {
                url: `api/cv/${id}/set_cv_institutions/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVCourses(id, data) {
    return {
        type: types.UPDATE_CV_EDUCATION,
        payload: {
            request: {
                url: `api/cv/${id}/set_cv_courses/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVCertificates(id, data) {
    return {
        type: types.UPDATE_CV_EDUCATION,
        payload: {
            request: {
                url: `api/cv/${id}/set_cv_certificates/`,
                method: 'post',
                data
            }
        }
    };
}

export function createCV() {
    return {
        type: types.CREATE_CV,
        payload: {
            request: {
                url: `api/cv/new_create/`,
                method: 'post',
            }
        }
    };
}

export function deleteCV(id) {
    return {
        type: types.DELETE_CV,
        payload: {
            request: {
                url: `api/cv/${id}/`,
                method: 'delete',
            }
        }
    };
}

export function copyCV(id) {
    return {
        type: types.COPY_CV,
        payload: {
            request: {
                url: `api/cv/${id}/copy/`,
                method: 'post',
            }
        }
    };
}


export function fetchCVs(query) {
  let queryString = '';
  for(let key in query){
    if(query[key] instanceof Array) {
      const vals = query[key];
      vals.map(val => {
        queryString += key + '=' + val + '&';
      });
    } else {
        queryString += key + '=' + query[key] + '&';
    }
  }
  return {
    type: types.FETCH_CVS,
    payload: {
      request: {
        url: `api/search_cv/?${queryString}`,
        method: 'get'
      }
    }
  };
}

export function fetchMoreCVs(queryString) {
  return {
      type: types.FETCH_MORE_CVS,
      payload: {
          request: {
              url: `/api/search_cv/?${queryString}`,
              method: 'get'
          }
      }
  }
}

export function addCVToFavorites(data) {
  return {
    type: types.ADD_CV_TO_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_cv/`,
        method: 'post',
        data
      }
    }
  }
}

export function removeCVFromFavorites(id) {
  return {
    type: types.REMOVE_CV_FROM_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_cv/${id}/`,
        method: 'delete',
      }
    }
  }
}

export function addCVListToFavorites(data) {
  return {
    type: types.ADD_CV_LIST_TO_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_cv/create_list/`,
        method: 'post',
        data
      }
    }
  }
}

export function removeCVListFromFavorites(data) {
    return {
      type: types.REMOVE_CV_LIST_FROM_FAVORITES,
      payload: {
        request: {
          url: `/api/favorites_cv/destroy_list/`,
          method: 'post',
          data
        }
      }
    }
}

export function toggleCVSelection(cv){
  return {
    type: types.TOGGLE_CV_SELECTION,
    payload: cv
  }
}

export function unselectAllCVs(){
  return {
    type: types.UNSELECT_ALL_CVS,
    payload: null
  }
}

export function updateCVFormErrors(errors) {
  return {
    type: types.UPDATE_CV_FORM_ERRORS,
    payload: {
      errors
    }
  }
}

export function fetchFavoritesCVs() {
  return {
    type: types.FETCH_FAVORITES_CVS,
    payload: {
      request: {
        url: `api/favorites_cv/`,
        method: 'get'
      }
    }
  };
}

export function fetchFilterFavoritesCVs(vacancy_id) {
  return {
    type: types.FETCH_FILTER_FAVORITES_CVS,
    payload: {
      request: {
        url: `api/favorites_cv/?vacancy_id=${vacancy_id}`,
        method: 'get'
      }
    }
  };
}

export function fetchMatchingCVs(id_code) {
  return {
    type: types.FETCH_MATCHING_CVS,
    payload: {
      request: {
        url: `api/vacancy/${id_code}/matching_cvs/`,
        method: 'get'
      }
    }
  };
}
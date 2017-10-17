import * as types from './actionsTypes_vacancies';

export function fetchMyVacancies(){
    return {
        type: types.FETCH_MY_VACANCIES,
        payload: {
            request: {
                url: '/api/vacancy/',
                method: 'get'
            }
        }
    }
}

export function fetchVacancy(id) {
    return {
        type: types.FETCH_VACANCY,
        payload: {
            request: {
                url: `/api/vacancy/${id}/`,
                method: 'get'
            }
        }
    }
}

export function updateVacancyActivity(id, data) {
    return {
        type: types.UPDATE_VACANCY_ACTIVITY,
        payload: {
            request: {
                url: `/api/vacancy/${id}/set_publish/`,
                method: 'post',
                data
            }
        }
    }
}

export function createVacancy() {
    return {
        type: types.CREATE_VACANCY,
        payload: {
            request: {
                url: `api/vacancy/new_create/`,
                method: 'post',
            }
        }
    };
}

export function deleteVacancy(id) {
    return {
        type: types.DELETE_VACANCY,
        payload: {
            request: {
                url: `api/vacancy/${id}/`,
                method: 'delete',
            }
        }
    };
}

export function copyVacancy(id) {
    return {
        type: types.COPY_VACANCY,
        payload: {
            request: {
                url: `api/vacancy/${id}/copy/`,
                method: 'post',
            }
        }
    };
}

export function fetchScopeActivity(query='') {
    return {
        type: types.FETCH_SCOPE_ACTIVITY,
        payload: {
            request: {
                url: `/api/scope_activity_options/?name=${query}`,
                method: 'get'
            }
        }
    }
}

export function updateVacancyTitleBox(id, data) {
    return {
        type: types.UPDATE_VACANCY_TITLEBOX,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_info_title/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyLanguages(id, data) {
    return {
        type: types.UPDATE_VACANCY_LANGUAGES,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_vacancy_language_skills/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyAbout(id, data) {
    return {
        type: types.UPDATE_VACANCY_ABOUT,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_about/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyLogo(id, data) {
    return {
        type: types.UPDATE_VACANCY_LOGO,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_logo/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancySkills(id, data) {
    return {
        type: types.UPDATE_VACANCY_SKILLS,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_requirements_candidate/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyCourses(id, data) {
    return {
        type: types.UPDATE_VACANCY_COURSES,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_vacancy_courses/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyCertificates(id, data) {
    return {
        type: types.UPDATE_VACANCY_CERTIFICATES,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_vacancy_certificates/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyConditions(id, data) {
    return {
        type: types.UPDATE_VACANCY_CONDITIONS,
        payload: {
            request: {
                url: `api/vacancy/${id}/set_working_conditions/`,
                method: 'post',
                data
            }
        }
    };
}

export function fetchTimeSchedules(query=''){
    return {
        type: types.FETCH_TIME_SCHEDULES,
        payload: {
            request: {
                url: `/api/time_schedule_options/`,
                method: 'get'
            }
        }
    };
}

export function fetchAdvantages(query='') {
    return {
        type: types.FETCH_VACANCY_ADVANTAGES,
        payload: {
            request: {
                url: `/api/advantage_options/?name=${query}`,
                method: 'get'
            }
        }
    };
}


export function fetchVacancies(query){
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
        type: types.FETCH_VACANCIES,
        payload: {
            request: {
                url: `/api/search_vacancy/?${queryString}`,
                method: 'get'
            }
        }
    }
}

export function fetchMoreVacancies(queryString) {
  return {
      type: types.FETCH_MORE_VACANCIES,
      payload: {
          request: {
              url: `/api/search_vacancy/?${queryString}`,
              method: 'get'
          }
      }
  }
}

export function addVacancyToFavorites(data) {
  return {
    type: types.ADD_VACANCY_TO_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_vacancy/`,
        method: 'post',
        data
      }
    }
  }
}

export function removeVacancyFromFavorites(id) {
  return {
    type: types.REMOVE_VACANCY_FROM_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_vacancy/${id}/`,
        method: 'delete',
      }
    }
  }
}

export function addVacanciesListToFavorites(data) {
  return {
    type: types.ADD_VACANCIES_LIST_TO_FAVORITES,
    payload: {
      request: {
        url: `/api/favorites_vacancy/create_list/`,
        method: 'post',
        data
      }
    }
  }
}

  export function removeVacanciesListFromFavorites(data) {
    return {
      type: types.REMOVE_VACANCIES_LIST_FROM_FAVORITES,
      payload: {
        request: {
          url: `/api/favorites_vacancy/destroy_list/`,
          method: 'post',
          data
        }
      }
    }
}

export function toggleVacancySelection(vacancy){
  return {
    type: types.TOGGLE_VACANCY_SELECTION,
    payload: vacancy
  }
}

export function unselectAllVacancies(){
  return {
    type: types.UNSELECT_ALL_VACANCIES,
    payload: null
  }
}

export function updateVacancyFormErrors(errors) {
  return {
    type: types.UPDATE_VACANCY_FORM_ERRORS,
    payload: {
      errors
    }
  }
}

export function fetchFavoritesVacancies() {
  return {
    type: types.FETCH_FAVORITES_VACANCIES,
    payload: {
      request: {
        url: `api/favorites_vacancy/`,
        method: 'get'
      }
    }
  };
}

export function fetchFilterFavoritesVacancies(cv_id) {
  return {
    type: types.FETCH_FILTER_FAVORITES_VACANCIES,
    payload: {
      request: {
        url: `api/favorites_vacancy/cv_id${cv_id}`,
        method: 'get'
      }
    }
  };
}

export function fetchMatchingVacancies(id_code) {
  return {
    type: types.FETCH_MATCHING_VACANCIES,
    payload: {
      request: {
        url: `api/cv/${id_code}/matching_vacancies/`,
        method: 'get'
      }
    }
  };
}

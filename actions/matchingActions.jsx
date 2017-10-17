import * as types from './actionsTypes_matching';

export function fetchMatchingCVsCount(id_code) {
  return {
    type: types.FETCH_MATCHING_CVS_COUNT,
    payload: {
      request: {
        url: `api/vacancy/${id_code}/matching_cvs/?matching_count=true`,
        method: 'get'
      }
    }
  };
}

export function fetchMatchingVacanciesCount(id_code) {
  return {
    type: types.FETCH_MATCHING_VACANCIES_COUNT,
    payload: {
      request: {
        url: `api/cv/${id_code}/matching_vacancies/?matching_count=true`,
        method: 'get'
      }
    }
  };
}
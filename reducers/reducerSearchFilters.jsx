import * as cv_types from '../actions/actionsTypes_cv';
import * as vacancy_types from '../actions/actionsTypes_vacancies';

export default function(state={}, action) {
  switch (action.type) {
    case cv_types.FETCH_CVS_SUCCESS:
    case vacancy_types.FETCH_VACANCIES_SUCCESS:
    case cv_types.FETCH_FAVORITES_CVS_SUCCESS:
    case vacancy_types.FETCH_FAVORITES_VACANCIES_SUCCESS:
    case cv_types.FETCH_FILTER_FAVORITES_CVS_SUCCESS:
    case vacancy_types.FETCH_FILTER_FAVORITES_VACANCIES_SUCCESS:
      const { results } = action.payload.data;
      if(results) return results.filters || {}
      return state;
  }
  return state;
}

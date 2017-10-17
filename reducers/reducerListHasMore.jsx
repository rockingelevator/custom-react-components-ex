import * as vacancy_types from '../actions/actionsTypes_vacancies';
import * as cv_types from '../actions/actionsTypes_cv';

export default function(state=false, action){
  switch(action.type){
    case cv_types.FETCH_CVS_SUCCESS:
    case vacancy_types.FETCH_VACANCIES_SUCCESS:
    case cv_types.FETCH_MORE_CVS_SUCCESS:
    case vacancy_types.FETCH_MORE_VACANCIES_SUCCESS:
      return action.payload.data.next;
  }
  return state;
}

import * as types from '../actions/actionsTypes_search';

export default function(state=[], action){
  switch(action.type){
    case types.SEARCH_CVS_SUCCESS:
    case types.SEARCH_VACANCIES_SUCCESS:
      return action.payload.data;
  }
  return state;
}

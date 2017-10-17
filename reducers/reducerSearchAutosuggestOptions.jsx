import * as types from '../actions/actionsTypes_search';

export default function (state=[], action) {
  switch(action.type) {
    case types.FETCH_SEARCH_AUTOSUGGEST_OPTIONS_SUCCESS:
      return action.payload.data;
  }
  return state;
}

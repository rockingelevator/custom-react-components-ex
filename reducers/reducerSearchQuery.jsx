import * as types from '../actions/actionsTypes_search';

export default function(state={type: 'cv'}, action) {
  switch(action.type) {
    case types.UPDATE_SEARCH_QUERY:
      return action.data;
  }
  return state;
}

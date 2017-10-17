import * as types from '../actions/actionTypes';

export default function(state=[], action) {
  switch(action.type) {
    case types.UPDATE_BREADCRUMBS:
      return action.data;
  }
  return state;
}

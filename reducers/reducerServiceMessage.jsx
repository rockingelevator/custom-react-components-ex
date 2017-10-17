import * as types from '../actions/actionTypes';

export default function(state={}, action) {
  switch(action.type) {
    case types.DISPATCH_SERVICE_MESSAGE:
      return action.payload;
  }
  return state;
}

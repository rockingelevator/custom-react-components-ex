import * as types from '../actions/actionTypes';

export default function(state=[], action){
  switch(action.type){
    case types.FETCH_POSITIONS_SUCCESS:
      return action.payload.data;
  }
  return state;
}

import * as types from '../actions/actionsTypes_cv';

export default function(state=[], action) {
  let cv;
  switch(action.type) {
    case types.TOGGLE_CV_SELECTION:
      cv = action.payload;
      let s = [...state];
      for(let i in s) {
        if (s[i].id == cv.id){
          s.splice(i ,1);
          return s;
        }
      }
      s.push(cv);
      return s;

    case types.UNSELECT_ALL_CVS:
      return [];
  }

  return state;
}

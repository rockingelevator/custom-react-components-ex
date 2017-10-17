import * as types from '../actions/actionsTypes_vacancies';

export default function(state=[], action) {
  let vacancy;
  switch(action.type) {
    case types.TOGGLE_VACANCY_SELECTION:
      vacancy = action.payload;
      let s = [...state];
      for(let i in s) {
        if (s[i].id == vacancy.id){
          s.splice(i ,1);
          return s;
        }
      }
      s.push(vacancy);
      return s;

    case types.UNSELECT_ALL_VACANCIES:
      return [];
  }

  return state;
}

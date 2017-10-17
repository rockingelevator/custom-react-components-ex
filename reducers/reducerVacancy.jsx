import * as types from '../actions/actionsTypes_vacancies';
import * as types_search from '../actions/actionsTypes_search';

export default function(state={}, action) {
    switch(action.type) {
        case types.FETCH_VACANCY_SUCCESS:
        case types.UPDATE_VACANCY_ACTIVITY_SUCCESS:
        case types.UPDATE_VACANCY_TITLEBOX_SUCCESS:
        case types.UPDATE_VACANCY_LANGUAGES_SUCCESS:
        case types.UPDATE_VACANCY_ABOUT_SUCCESS:
        case types.UPDATE_VACANCY_SKILLS_SUCCESS:
        case types.UPDATE_VACANCY_COURSES_SUCCESS:
        case types.UPDATE_VACANCY_CERTIFICATES_SUCCESS:
        case types.UPDATE_VACANCY_CONDITIONS_SUCCESS:
        case types_search.GET_VACANCY_SUCCESS:
        case types.UPDATE_VACANCY_LOGO_SUCCESS:
            return action.payload.data;

        case types.ADD_VACANCY_TO_FAVORITES_SUCCESS:
          if(action.payload.data.vacancy == state.id)
            return {...state, favorites: action.payload.data.id};

        case types.REMOVE_VACANCY_FROM_FAVORITES_SUCCESS:
        case types.REMOVE_VACANCIES_LIST_FROM_FAVORITES_SUCCESS:
          let ids = action.payload.data.vacancy_ids;
          if(ids && ids.indexOf(state.id) > -1)
            return {...state, favorites: null};
          return state;

        case types.ADD_VACANCIES_LIST_TO_FAVORITES_SUCCESS:
          let favs = action.payload.data;
          if(favs){
            favs.map(fav => {
              if(fav.vacancy == state.id) return {...state, favorites: fav.id};
            });
          }
          return state;
    }
    return state;
}

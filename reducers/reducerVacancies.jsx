import * as types from '../actions/actionsTypes_vacancies';

export default function(state=[], action) {
    switch(action.type) {
        case types.FETCH_MY_VACANCIES_SUCCESS:
            return action.payload.data;

        case types.FETCH_VACANCIES_SUCCESS:
            return action.payload.data.results.search_results;

        case types.FETCH_MORE_VACANCIES_SUCCESS:
        return [...state, ...action.payload.data.results.search_results];

        case types.UPDATE_VACANCY_ACTIVITY_SUCCESS:
        case types.UPDATE_VACANCY_TITLEBOX_SUCCESS:
            let vacancies = [];
            state.map(vac => {
                if(vac.id == action.payload.data.id){
                    vacancies.push(action.payload.data);
                } else {
                    vacancies.push(vac);
                }
            });
            return vacancies;

        case types.CREATE_VACANCY_SUCCESS:
        case types.COPY_VACANCY_SUCCESS:
            return [...state, action.payload.data];

        case types.DELETE_VACANCY_SUCCESS:
            let deletedPath = action.payload.config.url.split('/');
            const deletedId = deletedPath.splice(-2,1)[0];
            let updVacancies = [];
            state.map(vac => {
                if(vac.id_code != deletedId)
                    updVacancies.push(vac);
            });
            return updVacancies;

        case types.ADD_VACANCY_TO_FAVORITES_SUCCESS:
          let s = [...state];
          for(let i in s){
            if(s[i].id == action.payload.data.vacancy){
              s[i].favorites = action.payload.data.id;
              break;
            }
          }
          return s;

        case types.REMOVE_VACANCY_FROM_FAVORITES_SUCCESS:
        case types.REMOVE_VACANCIES_LIST_FROM_FAVORITES_SUCCESS:
          let ids = action.payload.data.vacancy_ids;
          s = [...state];
          for(let i in s){
            if(ids.indexOf(s[i].id) > -1)
              s[i].favorites = null;
          }
          return s;

        case types.ADD_VACANCIES_LIST_TO_FAVORITES_SUCCESS:
          let favs = action.payload.data;
          s = [...state];
          for(let i in s) {
            favs.map(fav => {
              if(fav.vacancy == s[i].id) s[i].favorites = fav.id;
            })
          }
          return s;

        case types.FETCH_FAVORITES_VACANCIES_SUCCESS:
            return action.payload.data.results.search_results;

        case types.FETCH_FILTER_FAVORITES_VACANCIES_SUCCESS:
            return action.payload.data.results.search_results;

        case types.FETCH_MATCHING_VACANCIES_SUCCESS:
            return action.payload.data.results;

        case types.FETCH_MATCHING_VACANCIES_FAIL:
            return [];

    }
    return state;
}

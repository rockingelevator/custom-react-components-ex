import * as types from '../actions/actionsTypes_cv';
import * as types_search from '../actions/actionsTypes_search';

export default function(state={}, action) {
    switch(action.type) {
        case types.FETCH_CV_SUCCESS:
        case types.UPDATE_CV_TITLEBOX_SUCCESS:
        case types.UPDATE_SUMMARYBOX_SUCCESS:
        case types.UPDATE_CV_LANGUAGES_SUCCESS:
        case types.UPDATE_CV_EXPERIENCE_SUCCESS:
        case types.UPDATE_CV_EDUCATION_SUCCESS:
        case types.UPDATE_CV_COURSES_SUCCESS:
        case types.CREATE_CV_SUCCESS:
        case types.COPY_CV_SUCCESS:
        case types_search.GET_CV_SUCCESS:
            return action.payload.data;

        case types.UPDATE_CV_PHOTO_SUCCESS:
            return {...state, jobseeker_photo: action.payload.data.jobseeker_photo};

        case types.UPDATE_CV_ACTIVITY_SUCCESS:
            return {...state, is_active: action.payload.data.is_active};

        case types.ADD_CV_TO_FAVORITES_SUCCESS:
          if(action.payload.data.cv == state.id)
            return {...state, favorites: action.payload.data.id};

        case types.REMOVE_CV_FROM_FAVORITES_SUCCESS:
        case types.REMOVE_CV_LIST_FROM_FAVORITES_SUCCESS:
          let ids = action.payload.data.cv_ids;
          if(ids && ids.indexOf(state.id) > -1)
            return {...state, favorites: null};
          return state;

        case types.ADD_CV_LIST_TO_FAVORITES_SUCCESS:
          let favs = action.payload.data;
          if(favs){
            favs.map(fav => {
              if(fav.cv == state.id) return {...state, favorites: fav.id};
            });
          }
          return state;
    }
    return state;
}

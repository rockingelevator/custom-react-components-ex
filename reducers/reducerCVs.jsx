import * as types from '../actions/actionsTypes_cv';

export default function(state=[], action) {
    switch(action.type) {
        case types.FETCH_MY_CVS_SUCCESS:
            return action.payload.data;

        case types.FETCH_CVS_SUCCESS:
            return action.payload.data.results.search_results;

        case types.FETCH_MORE_CVS_SUCCESS:
            return [...state, ...action.payload.data.results.search_results];

        case types.UPDATE_CV_ACTIVITY_SUCCESS:
        case types.UPDATE_CV_TITLEBOX_SUCCESS:
            let cvs = [];
            state.map(cv => {
                if(cv.id == action.payload.data.id){
                    cvs.push(action.payload.data);
                } else {
                    cvs.push(cv);
                }
            });
            return cvs;
        case types.CREATE_CV_SUCCESS:
        case types.COPY_CV_SUCCESS:
            return [...state, action.payload.data];

        case types.DELETE_CV_SUCCESS:
            let deletedPath = action.payload.config.url.split('/');
            const deletedId = deletedPath.splice(-2,1)[0];
            let updCvs = [];
            state.map(cv => {
                if(cv.id_code != deletedId)
                    updCvs.push(cv);
            });
            return updCvs;

        case types.ADD_CV_TO_FAVORITES_SUCCESS:
            let s = [...state];
            for(let i in s){
                if(s[i].id == action.payload.data.cv){
                    s[i].favorites = action.payload.data.id;
                    break;
                }
            }
            return s;

        case types.REMOVE_CV_FROM_FAVORITES_SUCCESS:
        case types.REMOVE_CV_LIST_FROM_FAVORITES_SUCCESS:
            let ids = action.payload.data.cv_ids;
            s = [...state];
            for(let i in s){
                if(ids.indexOf(s[i].id) > -1)
                    s[i].favorites = null;
            }
            return s;

        case types.ADD_CV_LIST_TO_FAVORITES_SUCCESS:
            let favs = action.payload.data;
            s = [...state];
            for(let i in s) {
                favs.map(fav => {
                    if(fav.cv == s[i].id) s[i].favorites = fav.id;
                })
            }
            return s;

        case types.FETCH_FAVORITES_CVS_SUCCESS:
            return action.payload.data.results.search_results;

        case types.FETCH_FILTER_FAVORITES_CVS_SUCCESS:
            return action.payload.data.results.search_results;


        case types.FETCH_MATCHING_CVS_SUCCESS:
            return action.payload.data.results;

        case types.FETCH_MATCHING_CVS_FAIL:
            return [];


    }
    return state;
}

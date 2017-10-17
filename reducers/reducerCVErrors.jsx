import * as types from "../actions/actionsTypes_cv";
import * as types_common from '../actions/actionTypes';

export default function(state={}, action) {
    switch(action.type) {
        case types.UPDATE_SUMMARYBOX_FAIL:
        case types.UPDATE_CV_ACTIVITY_FAIL:
        case types.UPDATE_CV_TITLEBOX_FAIL:
        case types.UPDATE_CV_LANGUAGES_FAIL:
        case types.UPDATE_CV_EXPERIENCE_FAIL:
        case types.UPDATE_CV_EDUCATION_FAIL:
        case types.UPDATE_CV_COURSES_FAIL:
        // case types.UPDATE_USER_CERTIFICATES_FAIL:
            return action.error.response.data;

        case types.UPDATE_SUMMARYBOX_SUCCESS:
        case types.UPDATE_CV_ACTIVITY_SUCCESS:
        case types.UPDATE_CV_TITLEBOX_SUCCESS:
        case types.UPDATE_CV_LANGUAGES_SUCCESS:
        case types.UPDATE_CV_EXPERIENCE_SUCCESS:
        case types.UPDATE_CV_EDUCATION_SUCCESS:
        case types.UPDATE_CV_COURSES_SUCCESS:
        case types_common.CLEAR_ERRORS:
        // case types.UPDATE_USER_CERTIFICATES_SUCCESS:
            return {};

        case types.UPDATE_CV_FORM_ERRORS:
          return {...state, ...action.payload.errors};
    }
    return state;
}

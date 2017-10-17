import * as types from "../actions/actionTypes";

export default function(state={}, action) {
    switch(action.type) {
        case types.UPDATE_USER_FAIL:
        case types.UPDATE_USER_ADDRESS_FAIL:
        case types.UPDATE_USER_EMAIL_FAIL:
        case types.UPDATE_USER_SOCIAL_FAIL:
        case types.UPDATE_USER_MESSANGERS_FAIL:
        case types.UPDATE_USER_PHOTO_FAIL:
        case types.UPDATE_USER_LANGUAGES_FAIL:
        case types.UPDATE_USER_EXPERIENCE_FAIL:
        case types.UPDATE_USER_GRADUATION_FAIL:
        case types.UPDATE_USER_COURSES_FAIL:
        case types.UPDATE_USER_CERTIFICATES_FAIL:
            return action.error.response.data;

        case types.UPDATE_USER_SUCCESS:
        case types.UPDATE_USER_ADDRESS_SUCCESS:
        case types.UPDATE_USER_EMAIL_SUCCESS:
        case types.UPDATE_USER_SOCIAL_SUCCESS:
        case types.UPDATE_USER_MESSANGERS_SUCCESS:
        case types.UPDATE_USER_PHOTO_SUCCESS:
        case types.UPDATE_USER_LANGUAGES_SUCCESS:
        case types.UPDATE_USER_EXPERIENCE_SUCCESS:
        case types.UPDATE_USER_GRADUATION_SUCCESS:
        case types.UPDATE_USER_COURSES_SUCCESS:
        case types.UPDATE_USER_CERTIFICATES_SUCCESS:
            return {};

        case types.UPDATE_PROFILE_FORM_ERRORS:
          return {...state, ...action.payload.errors};
    }
    return state;
}

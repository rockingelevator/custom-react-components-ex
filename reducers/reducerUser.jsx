import * as types from "../actions/actionTypes";
import * as types_employer from '../actions/actionTypes_employer';

export default function(state={}, action) {
    switch(action.type) {
        case types.FETCH_USER_SUCCESS:
            return action.payload.data;

        case types.SET_USER_INITIAL_DATA:
            return action.data;

        case types.UPDATE_USER_SUCCESS:
        case types.UPDATE_USER_ADDRESS_SUCCESS:
        case types.UPDATE_USER_EMAIL_SUCCESS:
        case types.UPDATE_USER_SOCIAL_SUCCESS:
        case types.UPDATE_USER_MESSANGERS_SUCCESS:
        case types.UPDATE_USER_LANGUAGES_SUCCESS:
        case types.UPDATE_USER_PHOTO_SUCCESS:
        case types.UPDATE_USER_EXPERIENCE_SUCCESS:
        case types.UPDATE_USER_GRADUATION_SUCCESS:
        case types.UPDATE_USER_COURSES_SUCCESS:
        case types.UPDATE_USER_CERTIFICATES_SUCCESS:
        case types.CONFIRM_USER_PHONE_SUCCESS:
        case types.CONFIRM_USER_PIN_CODE_SUCCESS:
        case types_employer.UPDATE_COMPANY_LOGO_SUCCESS:
        case types_employer.UPDATE_COMPANY_INFO_SUCCESS:
            return action.payload.data;
    }
    return state;
}

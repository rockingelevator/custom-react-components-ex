import * as types from "../actions/actionsTypes_vacancies";

export default function(state={}, action) {
    switch (action.type) {
        case types.FETCH_VACANCY_SUCCESS:
        case types.UPDATE_VACANCY_ACTIVITY_SUCCESS:
        case types.UPDATE_VACANCY_TITLEBOX_SUCCESS:
        case types.UPDATE_VACANCY_LANGUAGES_SUCCESS:
        case types.UPDATE_VACANCY_ABOUT_SUCCESS:
        case types.UPDATE_VACANCY_SKILLS_SUCCESS:
        case types.UPDATE_VACANCY_COURSES_SUCCESS:
        case types.UPDATE_VACANCY_CERTIFICATES_SUCCESS:
        case types.UPDATE_VACANCY_CONDITIONS_SUCCESS:
        case types.UPDATE_VACANCY_LOGO_SUCCESS:
            return {};
        case types.FETCH_VACANCY_FAIL:
        case types.UPDATE_VACANCY_ACTIVITY_FAIL:
        case types.UPDATE_VACANCY_TITLEBOX_FAIL:
        case types.UPDATE_VACANCY_LANGUAGES_FAIL:
        case types.UPDATE_VACANCY_ABOUT_FAIL:
        case types.UPDATE_VACANCY_SKILLS_FAIL:
        case types.UPDATE_VACANCY_COURSES_FAIL:
        case types.UPDATE_VACANCY_CERTIFICATES_FAIL:
        case types.UPDATE_VACANCY_CONDITIONS_FAIL:
        case types.UPDATE_VACANCY_LOGO_FAIL:
            return action.error.response.data;

        case types.UPDATE_VACANCY_FORM_ERRORS:
          return {...state, ...action.payload.errors};
    }
    return state;
}

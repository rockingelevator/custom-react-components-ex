import { combineReducers } from "redux";
import UserReducer from './reducerUser';
import ProfileErrorsReducer from './reducerProfileErrors';
import LanguagesReducer from './reducerLanguages';
import LanguageSkillsReducer from './reducerLanguageSkills';
import PositionsReducer from './reducerPositions';
import LevelInstitutionsReducer from './reducerLevelInstitutions';
import InstitutionsReducer from './reducerInstitutions';
import ServiceMessageReducer from './reducerServiceMessage';

import EmployerReducer from './reducerEmployer';
import EmployerErrorsReducer from './reducerEmployerErrors';

import CVsReducer from './reducerCVs';
import CVReducer from './reducerCV';
import CVErrorsReducer from './reducerCVErrors';
import SelectedCVReducer from './reducerSelectedCVs';

import VacanciesReducer from './reducerVacancies';
import VacancyReducer from './reducerVacancy';
import VacancyErrorsReducer from './reducerVacancyErrors';
import SelectedVacanciesReducer from './reducerSelectedVacancies';

import SearchQueryReducer from './reducerSearchQuery';
import SearchFiltersReducer from './reducerSearchFilters';
import ListHasMoreReducer from './reducerListHasMore';
import ListTotalCountReducer from './reducerListTotalCount';
import SearchAutosuggestOptionsReducer from './reducerSearchAutosuggestOptions';

import BreadcrumbsReducer from './reducerBreadcrumbs';

import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
    router: routerReducer,
    user: UserReducer,
    profileErrors: ProfileErrorsReducer,
    languages: LanguagesReducer,
    languageSkills: LanguageSkillsReducer,
    positions: PositionsReducer,
    levelInstitutions: LevelInstitutionsReducer,
    institutions: InstitutionsReducer,
    serviceMessage: ServiceMessageReducer,
    employer: EmployerReducer,
    employerErrors: EmployerErrorsReducer,
    CVs: CVsReducer,
    cv: CVReducer,
    cvErrors: CVErrorsReducer,
    vacancies: VacanciesReducer,
    vacancy: VacancyReducer,
    vacancyErrors: VacancyErrorsReducer,
    breadcrumbs: BreadcrumbsReducer,
    searchQuery: SearchQueryReducer,
    searchFilters: SearchFiltersReducer,
    isListHasMore: ListHasMoreReducer,
    listTotalCount: ListTotalCountReducer,
    selectedVacancies: SelectedVacanciesReducer,
    selectedCVs: SelectedCVReducer,
    searchAutosuggestOptions: SearchAutosuggestOptionsReducer,
});

export default rootReducer;

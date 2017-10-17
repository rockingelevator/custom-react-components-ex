import * as types from './actionsTypes_search';

export function updateSearchQuery(data) {
  return {
    type: types.UPDATE_SEARCH_QUERY,
    data
  }
}

export function fetchCVSearchAutosuggestOptions(q) {
  return {
    type: types.FETCH_SEARCH_AUTOSUGGEST_OPTIONS,
    payload: {
      request: {
        url: `/api/search_cv/autocomplete/?q=${q}`,
        method: 'get'
      }
    }
  }
}

export function fetchVacancySearchAutosuggestOptions(q) {
  return {
    type: types.FETCH_SEARCH_AUTOSUGGEST_OPTIONS,
    payload: {
      request: {
        url: `/api/search_vacancy/autocomplete/?q=${q}`,
        method: 'get'
      }
    }
  }
}

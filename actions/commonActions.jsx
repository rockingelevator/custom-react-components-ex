import * as types from './actionTypes';

export function updateBreadcrumbs(data) {
  return {
    type: types.UPDATE_BREADCRUMBS,
    data
  }
}

export function clearErrors() {
  return {
    type: types.CLEAR_ERRORS,
    data: {}
  }
}

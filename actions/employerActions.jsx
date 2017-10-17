import * as types from './actionTypes_employer.jsx';

export function fetchEmployer() {
    return {
        type: types.FETCH_EMPLOYER,
        payload: {
            request: {
                url: `api/current_profile/`,
                method: "get"
            }
        }
    };
}


export function updateCompanyInfo(id, data) {
    return {
        type: types.UPDATE_COMPANY_INFO,
        payload: {
            request: {
                url: `api/employers/${id}/`,
                method: 'put',
                data: data
            }
        }
    }
}


export function updateCompanyLogo(id, data) {
    return {
        type: types.UPDATE_COMPANY_LOGO,
        payload: {
            request: {
                url: `api/employers/${id}/set_logo/`,
                method: 'post',
                data: data
            }
        }
    }
}


export function updateCompanyHeadOffice(id, data) {
    return {
        type: types.UPDATE_COMPANY_HEADOFFICE,
        payload: {
            request: {
                url: `api/employers/${id}/set_main_office/`,
                method: 'post',
                data: data
            }
        }
    }
}


export function updateCompanyBranches(id, data) {
    return {
        type: types.UPDATE_COMPANY_BRANCHES,
        payload: {
            request: {
                url: `api/employers/${id}/set_offices/`,
                method: 'post',
                data: data
            }
        }
    }
}

export function updateCompanyFormErrors(errors) {
  return {
    type: types.UPDATE_COMPANY_FORM_ERRORS,
    payload: {
      errors
    }
  }
}

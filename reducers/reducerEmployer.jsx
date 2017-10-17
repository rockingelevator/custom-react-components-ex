import * as types from '../actions/actionTypes_employer';

export default function(state={}, action) {
    switch(action.type){
        case types.FETCH_EMPLOYER_SUCCESS:
        case types.UPDATE_COMPANY_INFO_SUCCESS:
            return action.payload.data;

        case types.UPDATE_COMPANY_LOGO_SUCCESS:
            return {...state, logo: action.payload.data.logo};

        case types.UPDATE_COMPANY_HEADOFFICE_SUCCESS:
            const data = action.payload.data;
            return {
                ...state,
                phone: data.phone,
                website: data.website,
                country: data.country,
                city: data.city,
                area: data.area,
                street: data.street,
                address: data.address
            };

        case types.UPDATE_COMPANY_BRANCHES_SUCCESS:
            return action.payload.data;
    }
    return state;
}
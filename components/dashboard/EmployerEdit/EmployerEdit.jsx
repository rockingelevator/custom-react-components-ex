import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router';
import {
    fetchEmployer,
    updateCompanyInfo,
    updateCompanyLogo,
    updateCompanyHeadOffice,
    updateCompanyBranches,
    updateCompanyFormErrors,
} from '../../../actions/employerActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import {
  updateBreadcrumbs
} from '../../../actions/commonActions';
import DashboardContent from '../DashboardContent';
import Collapsible from 'react-collapsible';
import SubNavigation from '../SubNavigation';
import SubNavigationItem from '../SubNavigationItem';
import SubNavigationLink from '../SubNavigationLink';

//forms
import EmployerCompanyForm from "../EmployerCompanyForm";
import EmployerHeadOfficeForm from '../EmployerHeadOfficeForm';
import EmployerBranchesList from '../EmployerBranchesList';


import s from './EmployerEdit.css';

const forms = [
    {name: 'info', path: ''},
    {name: 'headoffice', path: 'headoffice'},
    {name: 'branches', path: 'branches'},
];

class EmployerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: '',
            fetchingUpdate: false
        };
        this.updateBranche = null;
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';

        this._handleFormSubmit = this._handleFormSubmit.bind(this);
    }

    componentWillMount(){
        this.props.fetchEmployer()
            .then(response => {
                if(response.error) console.log(response.error);
            })
            .catch(error => {
                console.log(error);
            });
        this.props.updateBreadcrumbs([
          {
            link: '/dashboard/employer/',
            label: 'Мій профайл'
          },
          {
            link: '/dashboard/employer/edit/',
            label: 'Редагування профайлу'
          }
        ])
    }

    _handleFormInit(pageTitle) {
        this.setState({pageTitle});
        this.props.dispatchServiceMessage({show:false});
    }

    _handleFormSubmit(form, data){
        if(!form) return;
        const {
            employer,
            updateCompanyInfo,
            updateCompanyLogo,
            updateCompanyHeadOffice,
            updateCompanyBranches
        } = this.props;
        this.setState({
            fetchingUpdate: true
        });
        let submitFunc;
        switch(form) {
            case 'logo':
                submitFunc = updateCompanyLogo;
                break;
            case 'headoffice':
                submitFunc = updateCompanyHeadOffice;
                break;
            case 'branches':
                submitFunc = updateCompanyBranches;
                break;
            default:
                submitFunc = updateCompanyInfo;
        }
        submitFunc(employer.id, data)
            .then( response => {
                if (response.error) {
                    this.setState({
                        fetchingUpdate: false
                    });
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: true,
                        text: gettext('Не оновлено. Перевiрте введенi данi.')
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 2000);
                } else {
                    if (form == 'branches') {
                        this.updateBranche = true;
                    }
                    this.setState({
                        fetchingUpdate: false
                    });
                    // find next form to edit
                    let goNext;
                    forms.map((f, i) => {
                        if(f.name == form){
                            const nextForm = i + 1 >= forms.length ? 0 : forms[i+1];
                            if (nextForm)
                                goNext=`${this.baseUrl}${nextForm.path}`;
                        }
                    });
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Данi оновлено.'),
                        goNext,
                        buttonLabel: gettext('Додати ще iнформацiю')
                    });
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateBranche = null;
    }

    render() {
        const { match, employer, breadcrumbs } = this.props;
        const { baseUrl } = this;
        return (

        <div className="dashboardContentWrapper">
            <div className="dashboardContentWrapper__row">
                <div className="dashboardSidePanel sidepanel">

                    {/*LEFT SIDEBAR*/}
                    <SubNavigation>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label={employer ? employer.company_name : gettext('Моя компанiя')}
                                    path="#"
                                    active
                                />
                            }
                            open={true}
                            triggerDisabled={true}
                            transitionTime={200}
                        >
                            <SubNavigationLink
                                label={gettext("Про компанiю")}
                                path={baseUrl}
                            />
                            <SubNavigationLink
                                label={gettext("Головний офic")}
                                path={`${baseUrl}headoffice/`}
                            />
                            <SubNavigationLink
                                label={gettext("Представництва")}
                                path={`${baseUrl}branches/`}
                            />
                        </Collapsible>
                    </SubNavigation>

                </div>


                {/*CENTRAL CONTENT*/}


                    <DashboardContent
                      title={this.state.pageTitle}
                      breadcrumbs={breadcrumbs}
                      twoColumns
                    >
                        <div className='formWrapper'>
                            <Route
                                path={baseUrl}
                                exact
                                render={() => {
                                    return (
                                        <EmployerCompanyForm
                                            employer={employer}
                                            handleFormInit={this._handleFormInit.bind(this)}
                                            handleSubmit={this._handleFormSubmit}
                                            fetching={this.state.fetchingUpdate}
                                            errors={this.props.employerErrors}
                                            handleErrors={this.props.updateCompanyFormErrors}
                                        />
                                    )
                                }}
                            />

                            <Route
                                path={`${baseUrl}headoffice/`}
                                exact
                                render={() => {
                                    return (
                                        <EmployerHeadOfficeForm
                                            employer={employer}
                                            handleFormInit={this._handleFormInit.bind(this)}
                                            handleSubmit={this._handleFormSubmit}
                                            fetching={this.state.fetchingUpdate}
                                            errors={this.props.employerErrors}
                                            handleErrors={this.props.updateCompanyFormErrors}
                                        />
                                    )
                                }}
                            />

                            <Route
                                path={`${baseUrl}branches/`}
                                exact
                                render={() => {
                                    return (
                                        <EmployerBranchesList
                                            employer={employer}
                                            handleFormInit={this._handleFormInit.bind(this)}
                                            handleSubmit={this._handleFormSubmit}
                                            fetching={this.state.fetchingUpdate}
                                            updateBranche={this.updateBranche}
                                            errors={this.props.employerErrors}
                                            handleErrors={this.props.updateCompanyFormErrors}
                                        />
                                    )
                                }}
                            />
                        </div>
                    </DashboardContent>


            </div>
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        employer: state.employer,
        employerErrors: state.employerErrors,
        breadcrumbs: state.breadcrumbs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchEmployer,
        updateCompanyInfo,
        updateCompanyLogo,
        updateCompanyHeadOffice,
        updateCompanyBranches,
        dispatchServiceMessage,
        updateBreadcrumbs,
        updateCompanyFormErrors,
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployerEdit);

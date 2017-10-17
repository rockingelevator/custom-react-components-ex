import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    fetchMyVacancies,
    createVacancy,
    copyVacancy
} from '../../../actions/vacancyActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';

import { updateBreadcrumbs } from '../../../actions/commonActions';

import { Route } from 'react-router';
import SubNavigation from '../SubNavigation';
import SubNavigationItem from '../SubNavigationItem';
import SubNavigationLink from '../SubNavigationLink';
import Collapsible from 'react-collapsible';
import Button from '../../forms/Button';
import ResumeFillStats from '../ResumeFillStats';
import VacancyContent from '../VacancyContent';
import DashboardContent from '../DashboardContent';
import NoteList from '../NoteList';
import DashboardContentNotSelected from '../DashboardContentNotSelected';


import s from '../Resume/Resume.css';


const DUMMY_TIPS = [
    {tip: 'Cupcake ipsum dolor. Sit amet liquorice cake marzipan.'},
    {tip: 'Cake sweet cake biscuit caramels apple pie dessert. Marshmallow jelly-o lollipop. Dessert chocolate cake marzipan powder tootsie roll powder liquorice.'}
];


class Vacancy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vacancies: [],
            drafts: [],
            activeCVList: 'cvs'
        };
        this.baseUrl = props.match.url[props.match.url.length - 1] == '/' ? props.match.url : props.match.url + '/';
        this.baseBreadcrumb = {
          link: '/dashboard/my_vacancies/',
          label: 'Мої вакансії'
        };
    }

    componentWillMount(){
        this.props.updateBreadcrumbs([this.baseBreadcrumb]);
        this.props.fetchMyVacancies()
            .then(response => {
                //TODO preloader
            })
            .catch(error => {
                console.log(error);
            })
    }

    _createVacancy(){
        this.props.createVacancy()
            .then(response => {
                if(!response.error)
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id_code}`);
            })
    }

    _copyVacancy(vacancyId){
        this.props.copyVacancy(vacancyId)
            .then(response => {
                if(!response.error){
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id_code}`);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Копiю створено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            })
    }

    render(){
        const { activeCVList } = this.state;
        const vacancies = this.props.vacancies.filter(vac => {return vac.is_active});
        const drafts = this.props.vacancies.filter(vac => {return !vac.is_active});
        return (
            <div className="dashboardContentWrapper">
                <div className="dashboardContentWrapper__row">
                    <div className="dashboardSidePanel sidepanel">

                        {/*LEFT SIDEBAR*/}

                        <div className="btnsWrapper">
                            <Button
                                label={gettext("Нова вакансія")}
                                handleClick={this._createVacancy.bind(this)}
                            />
                        </div>
                        <SubNavigation>
                            <Collapsible
                                trigger={
                                    <SubNavigationItem
                                        label={gettext('Активні вакансії')}
                                        path="#"
                                    />
                                }
                                open={true}
                                transitionTime={200}
                            >
                                {
                                    vacancies.length > 0 && vacancies.map((vac, i) => {
                                        return (
                                            <div key={'vac-link-' + i}>
                                                <SubNavigationLink
                                                    label={vac.header}
                                                    path={`${this.baseUrl}${vac.id_code}`}
                                                    rightControl={
                                                      <i
                                                        className="icon-docs"
                                                        onClick={() => this._copyVacancy(vac.id_code)}
                                                        title={gettext("Створити копiю")}
                                                      />
                                                    }
                                                />
                                            </div>
                                        );
                                    })
                                }
                                {
                                    vacancies.length < 1 &&
                                    <p className="sidePanel__listEmptyLabel">
                                        {gettext('Немає активних вакансій')}
                                    </p>
                                }
                            </Collapsible>
                            <Collapsible
                                trigger={
                                    <SubNavigationItem
                                        label={gettext('Мої чернетки')}
                                        path="#"
                                    />
                                }
                                transitionTime={200}
                            >
                                {
                                    drafts.length > 0 && drafts.map((vac, i) => {
                                        return (
                                            <div key={'draft-link-' + i}>
                                                <SubNavigationLink
                                                    label={vac.header || gettext('Чернетка без назви')}
                                                    path={`${this.baseUrl}${vac.id_code}`}
                                                    rightControl={
                                                      <i
                                                        className="icon-docs"
                                                        onClick={() => this._copyVacancy(vac.id_code)}
                                                        title={gettext("Створити копiю")}
                                                      />
                                                    }
                                                />
                                            </div>
                                        );
                                    })
                                }
                                {
                                    drafts.length < 1 &&
                                    <p className="sidepanel__listEmptyLabel">
                                        {gettext('Немає чернеток')}
                                    </p>
                                }
                            </Collapsible>
                        </SubNavigation>
                    </div>


                    {/*CENTRAL CONTENT*/}

                    <div className={s.dashboardContentWrapper__dashboardContent}>
                        <DashboardContent
                          title=""
                          breadcrumbs={this.props.breadcrumbs}
                        >
                            <Route
                                exact
                                path={`${this.baseUrl}:vacancyId/`}
                                baseUrl={this.baseUrl}
                                component={VacancyContent}
                            />
                        </DashboardContent>
                    </div>

                    {/*RIGHT SIDEPANEL*/}

                    <div className="dashboardSidePanel sidepanel sidepanel_right">
                        <SubNavigation>
                            <Collapsible
                                trigger={
                                    <SubNavigationItem
                                        label={gettext('Рівень заповнення')}
                                        path="#"
                                        active
                                    />
                                }
                                open={true}
                                transitionTime={200}
                                className="somename"
                            >
                                <ResumeFillStats score={'30'} />
                            </Collapsible>
                            <Collapsible
                                trigger={
                                    <SubNavigationItem
                                        label={gettext('Підказки')}
                                        path="#"
                                    />
                                }
                                transitionTime={200}
                            >
                                <NoteList
                                    tips={DUMMY_TIPS}
                                />
                            </Collapsible>
                            <Collapsible
                                trigger={
                                    <SubNavigationItem
                                        label={gettext('Статистика переглядів')}
                                        path="#"
                                    />
                                }
                                transitionTime={200}
                            >
                                <div className="cvStatsCounterWrapper">
                                    <p><span className="cvStatsCounterWrapper__numbers">11</span> {gettext('сьогодні')}</p>
                                    <p><span className="cvStatsCounterWrapper__numbers">57</span> {gettext('усього')}</p>
                                </div>
                            </Collapsible>
                        </SubNavigation>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        vacancies: state.vacancies,
        breadcrumbs: state.breadcrumbs
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchServiceMessage,
        fetchMyVacancies,
        createVacancy,
        copyVacancy,
        updateBreadcrumbs
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacancy);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  fetchUser
} from '../../../actions/userActions';

import {
  dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import { Route} from 'react-router';
import { Link } from 'react-router-dom';
import s from './Dashboard.css';
import NavPanel from '../NavPanel';
import HeaderPanel from '../HeaderPanel';
import Profile from '../Profile';
import EmployerEdit from '../EmployerEdit';
import ServiceMessage from '../../common/ServiceMessage';
import Resume from '../Resume';
import Vacancy from '../Vacancy';
import Favorites from '../Favorites';
import Matching from '../Matching';

class Dashboard extends Component {

  componentWillMount(){
    const { user, fetchUser} = this.props;
    if(!user || (user && !user.id)) fetchUser();
  }

  render(){
    const { match, user } = this.props;
    return (
      <div className={s.dashboard}>
        <div className={s.dashboard__content}>
          <Route path={`${match.url}/profile/edit`} component={Profile}/>
          <Route path={`${match.url}/employer/edit`} component={EmployerEdit} />
          <Route path={`${match.url}/my_cv`} component={Resume}/>
          <Route path={`${match.url}/my_vacancies`} component={Vacancy}/>
          <Route path={`${match.url}/favorites`} component={Favorites}/>
          <Route path={`${match.url}/match`} component={Matching}/>
        </div>
        <HeaderPanel user={user}/>
        <NavPanel user={user} />
        <ServiceMessage
          message={this.props.serviceMessage}
          handleClose={(e) => this.props.dispatchServiceMessage({show: false})}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    serviceMessage: state.serviceMessage,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatchServiceMessage,
    fetchUser
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

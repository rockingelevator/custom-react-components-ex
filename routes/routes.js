import React from 'react';
import { Route, Redirect } from 'react-router';
import App from '../components/App';
import Home from '../components/home/Home';
import Dashboard from '../components/dashboard/Dashboard';
import Search from '../components/search/Search';
import VacancyDetail from '../components/details/VacancyDetail';
import CVDetail from '../components/details/CVDetail';

export default (
  <App>
    <div>
      <Route exact={true} path='/' component={Home} />
      <Route exact={true} path='/reset/:uid/:token' component={Home} />
      <Route exact={true} path='/activation_email/:key/' component={Home} />
      <Route exact={true} path='/social_require_email/:backend/' component={Home} />
      <Route exact={true} path='/social_activation_email/' component={Home} />
      <Route exact={true} path='/social_require_role/:backend/' component={Home} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/search/' component={Search} />
      <Route path='/vacancies/:id_code/' component={VacancyDetail} />
      <Route path='/cvs/:id_code/' component={CVDetail} />
    </div>
  </App>
)

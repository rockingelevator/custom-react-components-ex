import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import axiosMiddleware from 'redux-axios-middleware';
import api from "./actions/api";
import rootReducer from "./reducers/index";
import routes from './routes/routes';
import App from './components/App';


const history = createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const appRouterMiddleware = routerMiddleware(history)

const createStoreWithMiddleware = applyMiddleware(axiosMiddleware(api), appRouterMiddleware)(createStore);
const store = createStoreWithMiddleware(rootReducer);

render(
  <Provider store={store}>
    <ConnectedRouter history={history} children={routes}/>
   </Provider>,
  document.getElementById('app')
);

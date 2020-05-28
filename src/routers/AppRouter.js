import React from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../components/LoginPage';
import TaskDashboardPage from '../components/TaskDashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import GroupListPage from '../components/GroupListPage';
import GroupPage from '../components/GroupPage';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/dashboard" component={TaskDashboardPage} />
        <PrivateRoute path="/groups" component={GroupListPage} exact={true} />
        <PrivateRoute path="/groups/:id" component={GroupPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;

import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <div>
    <Header />
    <Route
      component={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
      {...rest}
    />
  </div>
);

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.user
});

export default connect(mapStateToProps)(PrivateRoute);

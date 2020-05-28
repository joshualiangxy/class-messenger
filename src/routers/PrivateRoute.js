import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    component={props => {
      console.log('isAuthenticated', isAuthenticated);
      return isAuthenticated ? <Component {...props} /> : <Redirect to="/" />;
    }}
    {...rest}
  />
);

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.user
});

export default connect(mapStateToProps)(PrivateRoute);

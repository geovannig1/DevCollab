import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Store } from '../../store';
import { AuthInitialState } from '../../reducers/authReducer';
import LinearProgress from '../global/LinearProgress';

interface PrivateRouteProps {
  component: React.FC<RouteProps>;
  auth: AuthInitialState;
  exact?: boolean;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  auth: { loading, isAuthenticated },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <LinearProgress />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to='/signin' />
        )
      }
    />
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);

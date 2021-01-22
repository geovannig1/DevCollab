import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Store } from '../../store';
import { AuthInitialState } from '../../reducers/authReducer';
import LinearProgress from '../global/LinearProgress';

interface PublicRouteProps {
  component: React.FC<RouteProps>;
  auth: AuthInitialState;
  exact?: boolean;
  path: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  component: Component,
  auth: { loading },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? <LinearProgress /> : <Component {...props} />
      }
    />
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PublicRoute);

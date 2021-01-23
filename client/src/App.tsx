import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { loadUser } from './actions/authActions';
import PrivateRoute from './components/routing/PrivateRoute';
import Route from './components/routing/PublicRoute';
import GlobalStyle from './components/global/GlobalStyle';
import Landing from './pages/Landing';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Project from './pages/Project';

interface AppProps {
  loadUser: () => void;
}

const App: React.FC<AppProps> = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Fragment>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/signin' component={Signin} />
          <PrivateRoute exact path='/projects' component={Project} />
        </Switch>
      </Router>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadUser: () => dispatch(loadUser()),
});

export default connect(null, mapDispatchToProps)(App);

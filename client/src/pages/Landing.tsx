import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import ScrollToTop from '../components/global/ScrollToTop';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import Footer from '../components/global/Footer';
import { clearProject } from '../actions/projectActions';

interface LandingProps {
  auth: AuthInitialState;
  clearProject: () => void;
}

const Landing: React.FC<LandingProps> = ({
  auth: { loading, isAuthenticated },
  clearProject,
}) => {
  useEffect(() => {
    document.title = 'Welcome to DevCollab';
    clearProject();
  }, [clearProject]);

  if (!loading && isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <Fragment>
      <ScrollToTop />
      <Hero />
      <About />
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearProject: () => dispatch(clearProject()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

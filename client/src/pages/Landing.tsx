import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import ScrollToTop from '../components/global/ScrollToTop';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import Footer from '../components/global/Footer';

interface LandingProps {
  auth: AuthInitialState;
}

const Landing: React.FC<LandingProps> = ({
  auth: { loading, isAuthenticated },
}) => {
  useEffect(() => {
    document.title = 'Welcome to DevCollab';
  }, []);

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

export default connect(mapStateToProps)(Landing);

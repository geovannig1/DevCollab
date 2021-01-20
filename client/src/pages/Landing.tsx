import React, { Fragment, useEffect } from 'react';

import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import ScrollToTop from '../components/global/ScrollToTop';

interface LandingProps {}

const Landing: React.FC<LandingProps> = () => {
  useEffect(() => {
    document.title = 'Welcome to DevCollab';
  });

  return (
    <Fragment>
      <ScrollToTop />
      <Hero />
      <About />
    </Fragment>
  );
};

export default Landing;

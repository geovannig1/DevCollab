import React, { Fragment } from 'react';

import Hero from '../components/landing/Hero';
import About from '../components/landing/About';

interface LandingProps {}

const Landing: React.FC<LandingProps> = () => {
  return (
    <Fragment>
      <Hero />
      <About />
    </Fragment>
  );
};

export default Landing;

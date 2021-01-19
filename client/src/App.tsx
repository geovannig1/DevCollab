import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Footer from './components/global/Footer';
import GlobalStyle from './components/global/GlobalStyle';
import Landing from './pages/Landing';

const App: React.FC = () => {
  return (
    <Fragment>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path='/' component={Landing} />
        </Switch>
      </Router>
      <Footer />
    </Fragment>
  );
};

export default App;

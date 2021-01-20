import React, { useEffect } from 'react';
import { History } from 'history';
import { withRouter } from 'react-router-dom';

interface ScrollToTopProps {
  history: History;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ history }) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, [history]);

  return null;
};

export default withRouter(ScrollToTop);

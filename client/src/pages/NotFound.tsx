import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { clearProject } from '../actions/projectActions';
import { clearNotFound, createNotFound } from '../actions/authActions';

interface NotFoundProps {
  clearProject: () => void;
  clearNotFound: () => void;
  createNotFound: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({
  clearProject,
  clearNotFound,
  createNotFound,
}) => {
  useEffect(() => {
    clearProject();
    createNotFound();

    return () => clearNotFound();
  }, [clearProject, clearNotFound, createNotFound]);

  return <div>Not Found</div>;
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearProject: () => dispatch(clearProject()),
  clearNotFound: () => dispatch(clearNotFound()),
  createNotFound: () => dispatch(createNotFound()),
});

export default connect(null, mapDispatchToProps)(NotFound);

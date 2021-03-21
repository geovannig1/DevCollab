import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import styled from 'styled-components';

import { Store } from '../../store';
import { GithubInitialState } from '../../reducers/githubReducer';
import Pagination from '@material-ui/lab/Pagination';
import GithubCard from '../../components/github/GithubCard';
import { loadPulls, removeEvent } from '../../actions/githubActions';

interface PullsProps {
  loadPulls: (projectId: string, page: number) => Promise<void>;
  removeEvent: (projectId: string, event: string) => Promise<void>;
  github: GithubInitialState;
  projectId: string;
}

const Pulls: React.FC<PullsProps> = ({
  loadPulls,
  removeEvent,
  github: { pull, pullEvent },
  projectId,
}) => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState('');

  useEffect(() => {
    loadPulls(projectId, page);
    removeEvent(projectId, 'pull');
  }, [loadPulls, removeEvent, projectId, page, pullEvent]);

  useEffect(() => {
    setLastPage(
      (prevLastPage) => pull?.pageInfo?.last?.page ?? (prevLastPage || '1')
    );
  }, [pull]);

  return (
    <Fragment>
      {pull && (
        <Fragment>
          {pull?.pulls.map((pull) => (
            <GithubCard key={pull.id} pull={pull} />
          ))}

          <StyledPagination
            onChange={(e, page) => setPage(page)}
            count={parseInt(lastPage ?? '')}
            variant='outlined'
            shape='rounded'
          />
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  github: state.github,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadPulls: (projectId: string, page: number) =>
    dispatch(loadPulls(projectId, page)),
  removeEvent: (projectId: string, event: string) =>
    dispatch(removeEvent(projectId, event)),
});

const StyledPagination = styled(Pagination)`
  margin-bottom: 50px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Pulls);

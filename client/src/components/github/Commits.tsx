import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import styled from 'styled-components';

import { Store } from '../../store';
import { GithubInitialState } from '../../reducers/githubReducer';
import Pagination from '@material-ui/lab/Pagination';
import GithubCard from '../../components/github/GithubCard';
import { loadCommits, removeEvent } from '../../actions/githubActions';

interface CommitsProps {
  loadCommits: (projectId: string, page: number) => Promise<void>;
  removeEvent: (projectId: string, event: string) => Promise<void>;
  github: GithubInitialState;
  projectId: string;
}

const Commits: React.FC<CommitsProps> = ({
  loadCommits,
  removeEvent,
  github: { commit, commitEvent },
  projectId,
}) => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState('');

  useEffect(() => {
    loadCommits(projectId, page);
    removeEvent(projectId, 'commit');
  }, [loadCommits, projectId, page, commitEvent, removeEvent]);

  useEffect(() => {
    setLastPage(
      (prevLastPage) => commit?.pageInfo?.last?.page ?? (prevLastPage || '1')
    );
  }, [commit]);

  return (
    <Fragment>
      {commit && (
        <Fragment>
          {commit?.commits.map((commit) => (
            <GithubCard key={commit.node_id} commit={commit} />
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
  loadCommits: (projectId: string, page: number) =>
    dispatch(loadCommits(projectId, page)),
  removeEvent: (projectId: string, event: string) =>
    dispatch(removeEvent(projectId, event)),
});

const StyledPagination = styled(Pagination)`
  margin-bottom: 50px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Commits);

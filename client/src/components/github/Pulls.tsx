import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Store } from '../../store';
import { GithubInitialState } from '../../reducers/githubReducer';
import Pagination from '@material-ui/lab/Pagination';
import GithubCard from '../../components/github/GithubCard';
import { loadPulls } from '../../actions/githubActions';

interface PullsProps {
  loadCommits: (projectId: string, page: number) => Promise<void>;
  github: GithubInitialState;
  projectId: string;
}

const Pulls: React.FC<PullsProps> = ({
  loadCommits,
  github: { pull },
  projectId,
}) => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState('');

  useEffect(() => {
    loadCommits(projectId, page);
  }, [loadCommits, projectId, page]);

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

          <Pagination
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
    dispatch(loadPulls(projectId, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pulls);

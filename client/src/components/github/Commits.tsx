import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Store } from '../../store';
import { GithubInitialState } from '../../reducers/githubReducer';
import Pagination from '@material-ui/lab/Pagination';
import GithubCard from '../../components/github/GithubCard';
import { loadCommits } from '../../actions/githubActions';

interface CommitsProps {
  loadCommits: (projectId: string, page: number) => Promise<void>;
  github: GithubInitialState;
  projectId: string;
}

const Commits: React.FC<CommitsProps> = ({
  loadCommits,
  github: { commit, commitEvent },
  projectId,
}) => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState('');

  useEffect(() => {
    loadCommits(projectId, page);
  }, [loadCommits, projectId, page, commitEvent]);

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
    dispatch(loadCommits(projectId, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Commits);

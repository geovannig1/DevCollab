import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { setColor, setRem } from '../styles';
import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { loadDiscussion } from '../actions/discussionActions';
import { DiscussionInitialState } from '../reducers/discussionReducer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DiscussionComment from '../components/discussion/DiscussionComment';
import { AuthInitialState } from '../reducers/authReducer';
import socket from '../utils/socketio';

interface DiscussionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
  discussion: DiscussionInitialState;
  auth: AuthInitialState;
  loadDiscussion: (projectId: string, discussionId: string) => Promise<void>;
}

const Discussion: React.FC<DiscussionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
  discussion: { selectedDiscussion },
  loadDiscussion,
  auth: { user },
}) => {
  const { projectId, discussionId } = useParams<{
    projectId: string;
    discussionId: string;
  }>();

  useEffect(() => {
    document.title = 'Discussion | DevCollab';
    setNavbar(SelectedType.Discussions);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  useEffect(() => {
    loadDiscussion(projectId, discussionId);

    socket.emit('join project', { projectId: selectedProject?._id });
    return () => {
      socket.emit('leave project', { projectId: selectedProject?._id });
    };
  }, [loadDiscussion, projectId, discussionId, selectedProject?._id]);

  return (
    <Fragment>
      {selectedDiscussion && (
        <Paper>
          <Previous
            link={`/projects/${projectId}/discussions`}
            previousTo='Discussions'
            title={selectedDiscussion.title}
          />
          <Container>
            {selectedDiscussion.creator && (
              <Creator>
                {`Created by ${selectedDiscussion.creator} on ${dayjs(
                  selectedDiscussion.date
                ).format('DD MMM YYYY')}`}
              </Creator>
            )}

            <p>{selectedDiscussion.description}</p>

            {selectedDiscussion.attachment && (
              <AttachmentLink
                target='_blank'
                rel='noopener noreferrer'
                href={selectedDiscussion.attachment?.url}
              >
                <AttachmentIcon fontSize='small' />
                <span>Attachment</span>
              </AttachmentLink>
            )}
          </Container>

          <Line />

          <DiscussionComment
            selectedDiscussion={selectedDiscussion}
            selectedProject={selectedProject}
            user={user}
          />
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  discussion: state.discussion,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadDiscussion: (projectId: string, discussionId: string) =>
    dispatch(loadDiscussion(projectId, discussionId)),
});

const Container = styled.div`
  margin: 10px 0;
  p {
    margin: 10px 0;
  }
`;

const Creator = styled.span`
  font-size: ${setRem(14)};
  color: ${setColor.lightBlack};
`;

const AttachmentLink = styled.a`
  background-color: ${setColor.primary};
  color: ${setColor.mainWhite};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 5px;
  margin: 10px 0;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${setColor.primaryDark};
  }
  &:active {
    background-color: ${setColor.primary};
  }
  span {
    font-size: ${setRem(14)};
  }
`;

const Line = styled.span`
  display: block;
  width: 100%;
  border-top: 2px solid ${setColor.darkGrey};
  margin: 20px 0;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);

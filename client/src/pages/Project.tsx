import React, { useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Link } from 'react-router-dom';

import { Store } from '../store';
import {
  loadProjects,
  deleteProject,
  clearProject,
} from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '../components/global/Button';
import Card from '../components/global/Card';
import { setColor, media } from '../styles';
import { AuthInitialState } from '../reducers/authReducer';
import { clearActivity } from '../actions/activityActions';
import { clearGithub } from '../actions/githubActions';
import { clearNote } from '../actions/noteActions';
import { clearFile } from '../actions/fileActions';
import { clearDiscussion } from '../actions/discussionActions';
import { clearMeeting } from '../actions/meetingActions';
import { clearTask } from '../actions/taskActions';

interface ProjectProps {
  loadProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearProject: () => void;
  clearGithub: () => void;
  clearActivity: () => void;
  clearMeeting: () => void;
  clearNote: () => void;
  clearFile: () => void;
  clearDiscussion: () => void;
  clearTask: () => void;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const Project: React.FC<ProjectProps> = ({
  loadProjects,
  deleteProject,
  clearProject,
  clearActivity,
  clearGithub,
  clearMeeting,
  clearNote,
  clearFile,
  clearDiscussion,
  clearTask,
  project: { projects },
  auth: { user },
}) => {
  useEffect(() => {
    document.title = 'Projects | DevCollab';

    //Only load if project undefined
    if (!projects) {
      clearProject();
      clearActivity();
      clearGithub();
      clearMeeting();
      clearNote();
      clearFile();
      clearDiscussion();
      clearTask();

      loadProjects();
    }
  }, [
    projects,
    loadProjects,
    clearProject,
    clearActivity,
    clearGithub,
    clearMeeting,
    clearNote,
    clearFile,
    clearDiscussion,
    clearTask,
  ]);

  return (
    <Fragment>
      <H1>Projects.</H1>
      <StyledButton small={'small' ? 1 : 0} as={Link} to='/create-project'>
        <AddIcon fontSize='small' /> Start New Project
      </StyledButton>
      <ProjectContainer>
        {projects?.map((project) => (
          <CardLink key={project._id}>
            <Card
              projectId={project._id}
              link={`/projects/${project._id}/activity`}
              title={project.name}
              members={project.members}
              user={user}
              description={project.description}
              deleteTitle={`Delete Project`}
              deleteText={`Are you sure want to delete ${project.name} project? this process can't be undone.`}
              deleteItem={() => deleteProject(project._id)}
              editLink={`/projects/${project._id}/edit`}
            />
          </CardLink>
        ))}
      </ProjectContainer>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProjects: () => dispatch(loadProjects()),
  deleteProject: (projectId: string) => dispatch(deleteProject(projectId)),
  clearProject: () => dispatch(clearProject()),
  clearActivity: () => dispatch(clearActivity()),
  clearGithub: () => dispatch(clearGithub()),
  clearMeeting: () => dispatch(clearMeeting()),
  clearNote: () => dispatch(clearNote()),
  clearFile: () => dispatch(clearFile()),
  clearDiscussion: () => dispatch(clearDiscussion()),
  clearTask: () => dispatch(clearTask()),
});

const H1 = styled.h1`
  font-weight: 500;
  color: ${setColor.mainBlack};
  margin-bottom: 15px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 20px;
`;

const ProjectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;

  @media ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
  @media ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${media.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CardLink = styled.div`
  position: relative;
  width: 250px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Project);

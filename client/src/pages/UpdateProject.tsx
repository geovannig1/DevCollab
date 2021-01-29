import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Link, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { History } from 'history';

import { setColor } from '../styles';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import { ProjectInitialState } from '../reducers/projectReducer';
import { ProjectData } from '../actions/projectTypes';
import { loadProjects, updateProject } from '../actions/projectActions';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Paper from '../components/global/Paper';
import ProjectForm from '../components/project/ProjectForm';

interface UpdateProjectProps {
  auth: AuthInitialState;
  project: ProjectInitialState;
  loadProjects: () => Promise<void>;
  updateProject: (
    projectData: ProjectData,
    projectId: string,
    history: History
  ) => Promise<void>;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({
  auth: { user },
  project: { projects },
  loadProjects,
  updateProject,
}) => {
  useEffect(() => {
    document.title = 'Update project | DevCollab';
    projects.length === 0 && loadProjects();
  }, [projects, loadProjects]);

  const history = useHistory();
  const { projectId } = useParams<{ projectId: string }>();

  const updateProjectData = projects?.find(
    (project) => project._id.toString() === projectId
  );

  //Take access permission and email for the form
  let memberProjectData = updateProjectData?.members.map((member) => {
    const accessPermission = member.accessPermission;
    const email = member.user.email;
    return { accessPermission: accessPermission, email };
  });
  memberProjectData = memberProjectData?.filter(
    (member) => member.email !== user?.email
  );

  //Form state
  const [projectData, setProjectData] = useState<ProjectData>({
    name: updateProjectData?.name ?? '',
    description: updateProjectData?.description ?? '',
    members: memberProjectData ?? [],
  });
  //Submit form data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProject(projectData, projectId, history);
  };

  return (
    <Fragment>
      <Header>
        <Previous to='/projects'>
          <ArrowBackIosIcon />
          <span>Projects</span>
        </Previous>
        <Title>{projectData.name.trim() || 'Project Name'}</Title>
      </Header>
      <Paper>
        {user && (
          <ProjectForm
            update
            setProjectData={setProjectData}
            projectData={projectData}
            handleSubmit={handleSubmit}
            user={user}
          />
        )}
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
  project: state.project,
});
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProjects: () => dispatch(loadProjects()),
  updateProject: (
    projectData: ProjectData,
    projectId: string,
    history: History
  ) => dispatch(updateProject(projectData, projectId, history)),
});

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Previous = styled(Link)`
  color: ${setColor.lightBlack};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  user-select: none;
  outline: none;
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const Title = styled.h2`
  margin: 0 15px;
  color: ${setColor.mainBlack};
  font-weight: 500;
`;

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProject);

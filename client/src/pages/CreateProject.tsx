import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { History } from 'history';

import { setColor } from '../styles';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import { ProjectInitialState } from '../reducers/projectReducer';
import { ProjectData } from '../actions/projectTypes';
import { createProject, loadProjects } from '../actions/projectActions';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Paper from '../components/global/Paper';
import ProjectForm from '../components/project/ProjectForm';

interface CreateProjectProps {
  auth: AuthInitialState;
  project: ProjectInitialState;
  createProject: (projectData: ProjectData, history: History) => Promise<void>;
  loadProjects: () => Promise<void>;
}

const CreateProject: React.FC<CreateProjectProps> = ({
  auth: { user },
  project: { projects },
  createProject,
  loadProjects,
}) => {
  useEffect(() => {
    document.title = 'Create new project | DevCollab';
    !projects && loadProjects();
  }, [projects, loadProjects]);

  //Form state
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    members: [],
  });

  const history = useHistory();
  //Submit form data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createProject(projectData, history);
  };

  return (
    <Fragment>
      <Header>
        <Previous to='/projects'>
          <ArrowBackIosIcon />
          <span>Projects</span>
        </Previous>
        <Title>{projectData.name.trim() || 'Create Project'}</Title>
      </Header>
      <Paper>
        {user && (
          <ProjectForm
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
  createProject: (projectData: ProjectData, history: History) =>
    dispatch(createProject(projectData, history)),
  loadProjects: () => dispatch(loadProjects()),
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);

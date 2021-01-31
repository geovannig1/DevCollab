import React, { useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Link } from 'react-router-dom';

import { Store } from '../store';
import { loadProjects, deleteProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '../components/global/Button';
import Card from '../components/global/Card';
import { setColor } from '../styles';
import { AuthInitialState } from '../reducers/authReducer';

interface ProjectProps {
  loadProjects: () => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const Project: React.FC<ProjectProps> = ({
  loadProjects,
  deleteProject,
  project: { projects },
  auth: { user },
}) => {
  useEffect(() => {
    document.title = 'Projects | DevCollab';

    //Only load if project undefined
    !projects && loadProjects();
  }, [projects, loadProjects]);

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
  deleteProject: (projectId: number) => dispatch(deleteProject(projectId)),
});

const H1 = styled.h1`
  font-weight: 500;
  color: ${setColor.mainBlack};
  margin-bottom: 25px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 20px;
`;

const ProjectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;
`;

const CardLink = styled.div`
  position: relative;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Project);

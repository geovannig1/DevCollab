import React, { useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Link } from 'react-router-dom';

import { Store } from '../store';
import { loadProjects } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '../components/global/Button';
import Card from '../components/global/Card';

interface ProjectProps {
  loadProjects: () => Promise<void>;
  project: ProjectInitialState;
}

const Project: React.FC<ProjectProps> = ({
  loadProjects,
  project: { shownProject },
}) => {
  useEffect(() => {
    document.title = 'Projects | DevCollab';

    //Only load if project undefined
    !shownProject && loadProjects();
  }, [shownProject, loadProjects]);

  return (
    <Fragment>
      <StyledButton small={'small' ? 1 : 0} as={Link} to='/create-project'>
        <AddIcon fontSize='small' /> Start New Project
      </StyledButton>
      <ProjectContainer>
        {shownProject?.map((project) => (
          <Card
            key={project._id}
            title={project.name}
            description={project.description}
          />
        ))}
      </ProjectContainer>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProjects: () => dispatch(loadProjects()),
});

const StyledButton = styled(Button)`
  margin-bottom: 20px;
`;

const ProjectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Project);

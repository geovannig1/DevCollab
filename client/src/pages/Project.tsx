import React, { useEffect } from 'react';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import Base from '../components/global/Base';
import { Button } from '../components/global/Button';
import Paper from '../components/global/Paper';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = () => {
  useEffect(() => {
    document.title = 'Projects | DevCollab';
  });

  return (
    <Base>
      <StyledButton small>
        <AddIcon fontSize='small' /> Start New Project
      </StyledButton>
      <ProjectContainer>
        <Paper></Paper>
        <Paper></Paper>
      </ProjectContainer>
    </Base>
  );
};

const StyledButton = styled(Button)`
  margin: 20px 0;
`;

const ProjectContainer = styled.div`
  display: flex;
`;

export default Project;

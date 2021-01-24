import React from 'react';
import styled from 'styled-components';
import { match } from 'react-router-dom';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { setColor } from '../../styles';
import Sidebar from '../sidebar/Sidebar';

interface BaseComponentProps {
  match?: match;
}

const BaseComponent: React.FC<BaseComponentProps> = ({ children, match }) => {
  console.log(match);

  return (
    <Container>
      <Sidebar />
      <ChildrenContainer>
        <ArrowBackIosIcon />
        <Title>Projects</Title>
        {children}
      </ChildrenContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${setColor.mainGrey};
  display: flex;
  min-height: 100vh;
`;

const ChildrenContainer = styled.div`
  margin: 40px;
  margin-left: 25%;
  width: 100%;
`;

const Title = styled.h2`
  color: ${setColor.primary};
  font-weight: 600;
`;

export default BaseComponent;

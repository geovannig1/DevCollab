import React from 'react';
import styled from 'styled-components';

import { setColor } from '../../styles';
import Sidebar from '../sidebar/Sidebar';

interface BaseProps {}

const Base: React.FC<BaseProps> = ({ children }) => {
  return (
    <Container>
      <Sidebar />
      <ChildrenContainer>
        <Title>Projects</Title>
        {children}
      </ChildrenContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${setColor.mainGrey};
  display: flex;
`;

const ChildrenContainer = styled.div`
  margin: 40px;
  width: 100%;
`;

const Title = styled.h2`
  color: ${setColor.primary};
  font-weight: 600;
`;

export default Base;

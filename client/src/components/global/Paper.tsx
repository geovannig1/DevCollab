import React from 'react';
import styled from 'styled-components';

import { setColor, setShadow } from '../../styles';

interface PaperProps {}

const Paper: React.FC<PaperProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: ${setColor.mainWhite};
  min-width: 250px;
  height: 300px;
  cursor: pointer;
  box-shadow: ${setShadow.main};
  border-radius: 10px;
  transition: 0.2s ease-in-out;
  margin-right: 50px;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
`;

export default Paper;

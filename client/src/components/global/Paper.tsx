import React from 'react';
import styled from 'styled-components';

import { setColor, setShadow } from '../../styles';

const Paper: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: ${setColor.mainWhite};
  padding: 20px;
  box-shadow: ${setShadow.main};
  border-radius: 10px;
  position: relative;
`;

export default Paper;

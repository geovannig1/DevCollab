import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setShadow } from '../../styles';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <Container>
      <Link to='/projects'>Activity</Link>
    </Container>
  );
};

const Container = styled.nav`
  background-color: ${setColor.mainWhite};
  box-shadow: ${setShadow.main};
  width: 75vw;
  height: 70px;
  margin: 20px 0;
  border-radius: 10px;
`;

export default Navbar;

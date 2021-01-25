import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor } from '../../styles';
import ProfileSidebar from '../sidebar/ProfileSidebar';
import { ReactComponent as Logo } from '../../assets/logo.svg';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <Container>
      <Link to='/projects'>
        <StyledLogo />
      </Link>
      <ProfileSidebar />
    </Container>
  );
};

const Container = styled.aside`
  height: 100vh;
  width: 22vw;
  position: fixed;
  background-color: ${setColor.mainWhite};
`;

const StyledLogo = styled(Logo)`
  width: 180px;
  margin: 10px 20px;
  user-select: none;
`;

export default Sidebar;

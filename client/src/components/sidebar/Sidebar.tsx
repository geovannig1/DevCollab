import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setShadow } from '../../styles';
import ProfileSidebar from '../sidebar/ProfileSidebar';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import CalendarSidebar from './CalendarSidebar';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <Container>
      <StyledLink to='/projects'>
        <StyledLogo />
      </StyledLink>
      <ProfileSidebar />
      <CalendarSidebar />
    </Container>
  );
};

const Container = styled.aside`
  height: 100vh;
  width: 22vw;
  position: fixed;
  z-index: 99;
  background-color: ${setColor.mainWhite};
  box-shadow: ${setShadow.main};
  overflow-y: auto;
`;

const StyledLogo = styled(Logo)`
  width: 180px;
  margin: 4px 20px;
  user-select: none;
`;

const StyledLink = styled(Link)`
  outline: none;
`;

export default Sidebar;

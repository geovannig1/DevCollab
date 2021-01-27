import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { clearProject } from '../../actions/projectActions';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { setColor } from '../../styles';
import Sidebar from '../sidebar/Sidebar';

interface BaseComponentProps {
  clearProject: () => void;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  children,
  clearProject,
}) => {
  useEffect(() => {
    return () => clearProject();
  }, [clearProject]);

  const { pathname } = useLocation();
  const params = pathname.split('/')[2];

  return (
    <Container>
      <Sidebar />
      <ChildrenContainer>
        <Header>
          {pathname !== '/projects' &&
            pathname !== '/create-project' &&
            pathname !== `/projects/${params}/edit` && (
              <Previous to='/projects' pathname={pathname}>
                <ArrowBackIosIcon />
                <span>Projects</span>
              </Previous>
            )}
        </Header>
        {children}
      </ChildrenContainer>
    </Container>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearProject: () => dispatch(clearProject()),
});

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

const Header = styled.div`
  color: ${setColor.primary};
  display: flex;
  align-items: center;
`;

interface PreviousProps {
  pathname: string;
}

const Previous = styled(Link)<PreviousProps>`
  color: ${setColor.lightBlack};
  display: flex;
  align-items: center;
  margin-right: 20px;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default connect(null, mapDispatchToProps)(BaseComponent);

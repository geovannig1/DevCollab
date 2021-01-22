import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setRem } from '../../styles';
import { ReactComponent as Logo } from './logo-white.svg';
import { ReactComponent as CollaborationVector } from './collaboration.svg';
import ScrollToTop from '../global/ScrollToTop';
import { Button } from '../global/Button';

interface BaseAuthProps {
  title: string;
  googleButtonText: string;
  otherAuth: 'SIGNUP' | 'SIGNIN';
}

const BaseAuth: React.FC<BaseAuthProps> = ({
  children,
  title,
  googleButtonText,
  otherAuth,
}) => {
  return (
    <Fragment>
      <ScrollToTop />
      <Container>
        <Aside>
          <Link to='/'>
            <StyledLogo />
          </Link>
          <StyledVector />
        </Aside>
        <Content>
          <h1>{title}</h1>
          {children}
          <SeparatorContainer>
            <div />
            <span>OR</span>
            <div />
          </SeparatorContainer>
          <GoogleButton>
            <Button as='a' href='/api/auth/google' small outline>
              <i className='fab fa-google' />
              {googleButtonText}
            </Button>
          </GoogleButton>
          <StyledLink to={`/${otherAuth === 'SIGNIN' ? 'signin' : 'signup'}`}>
            {otherAuth === 'SIGNUP'
              ? "Don't have an account yet? Sign Up"
              : 'Already have an account? Login'}
          </StyledLink>
        </Content>
      </Container>
    </Fragment>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const Aside = styled.aside`
  top: 0;
  min-width: 40vw;
  min-height: 100vh;
  background-color: ${setColor.primary};
  display: grid;
`;

const StyledLogo = styled(Logo)`
  width: 150px;
  margin: 10px 20px;
  position: absolute;
`;

const StyledVector = styled(CollaborationVector)`
  width: 500px;
  justify-self: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5%;
  min-height: 100vh;
  color: ${setColor.primary};
  h1 {
    font-weight: 600;
    font-size: ${setRem(30)};
    margin: 20px 0;
  }
`;

const SeparatorContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
  div {
    border-top: 3px solid ${setColor.primary};
    width: 12%;
  }
  span {
    color: ${setColor.primary};
    font-weight: 500;
    margin: 0 10px;
  }
`;

const GoogleButton = styled.div`
  i {
    font-size: ${setRem(20)};
    margin-right: 5px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${setColor.primary};
  font-weight: 500;
  margin: 10px 0;
  font-size: ${setRem(14)};
  &:hover {
    color: ${setColor.primaryDark};
  }
`;

export default BaseAuth;

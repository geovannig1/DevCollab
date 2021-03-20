import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setRem, setGradient, media } from '../../styles';
import { ReactComponent as Logo } from '../../assets/logo-white.svg';
import { ReactComponent as CollaborationVector } from '../../assets/collaboration.svg';
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
        <LeftContainer>
          <Link to='/'>
            <StyledLogo />
          </Link>
          <StyledVector />
        </LeftContainer>
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
  position: relative;

  @media ${media.sm} {
    flex-direction: column;
  }
`;

const LeftContainer = styled.div`
  top: 0;
  min-width: 40vw;
  min-height: 100vh;
  background: ${setGradient(['left', ''])};
  display: grid;
  position: relative;
  a {
    width: 150px;
    height: 50px;
  }

  @media ${media.sm} {
    min-width: 100vw;
    min-height: 100%;
  }
`;

const StyledLogo = styled(Logo)`
  width: 150px;
  margin: 10px 20px;
  position: absolute;

  @media ${media.sm} {
    width: 100px;
    margin: 0 20px;
    height: 100%;
  }
`;

const StyledVector = styled(CollaborationVector)`
  width: 500px;
  justify-self: center;
  position: absolute;
  top: 200px;

  @media ${media.md} {
    width: 350px;
  }
  @media ${media.sm} {
    display: none;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8%;
  margin-left: 5%;
  h1 {
    color: ${setColor.primary};
    font-weight: 600;
    font-size: ${setRem(30)};
    margin: 25px 0;
  }

  @media ${media.sm} {
    margin-top: 4%;
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
  outline: none;
  &:hover {
    color: ${setColor.primaryDark};
  }
`;

export default BaseAuth;

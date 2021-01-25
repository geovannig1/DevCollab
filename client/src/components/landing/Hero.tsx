import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setRem } from '../../styles';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as CollabVector } from '../../assets/collab-vector.svg';
import { Button } from '../global/Button';

const Hero: React.FC = () => {
  return (
    <Fragment>
      <Link to='/'>
        <StyledLogo />
      </Link>
      <Container>
        <LeftContainer>
          <h1>DevCollab</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam, lacinia dignissim lacus sagittis eget.
          </p>
          <Button as={Link} to='/signup'>
            Sign Up
          </Button>
          <Button outline={'outline' && 1} as={Link} to='signin'>
            Sign In
          </Button>
        </LeftContainer>
        <StyledVector />
      </Container>
    </Fragment>
  );
};

const StyledLogo = styled(Logo)`
  width: 150px;
  margin: 10px 20px;
  position: absolute;
  user-select: none;
`;

const StyledVector = styled(CollabVector)`
  height: 100%;
  width: 1500px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5%;
  min-height: 100vh;
`;

const LeftContainer = styled.div`
  h1 {
    color: ${setColor.primary};
    font-size: ${setRem(60)};
  }
  p {
    color: ${setColor.primaryLight};
    font-weight: 500;
    margin: 20px 0;
    padding-right: 100px;
    font-size: ${setRem(20)};
  }
  a:last-child {
    margin: 0 10px;
  }
`;

export default Hero;

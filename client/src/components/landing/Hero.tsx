import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setRem } from '../../styles';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as CollabVector } from './collab-vector.svg';
import { Button } from '../global/Button';

const StyledLogo = styled(Logo)`
  width: 150px;
  margin: 10px 20px;
  position: absolute;
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
    color: ${setColor.secondary};
    font-weight: 500;
    margin: 20px 0;
    padding-right: 100px;
    font-size: ${setRem(20)};
  }
  button:last-child {
    margin: 0 10px;
  }
`;

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
          <Button>Sign Up</Button>
          <Button outline>Sign In</Button>
        </LeftContainer>
        <StyledVector />
      </Container>
    </Fragment>
  );
};

export default Hero;

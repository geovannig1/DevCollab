import React from 'react';

import styled from 'styled-components';
import { setRem, setColor } from '../../styles';
import { ReactComponent as Monitoring } from './monitoring.svg';
import { ReactComponent as Task } from './task.svg';
import { ReactComponent as Meeting } from './meeting.svg';
import { ReactComponent as Github } from './github.svg';
import { ReactComponent as Discussion } from './discussion.svg';

const About: React.FC = () => {
  return (
    <Container>
      <Header>
        <h1>About DevCollab</h1>
        <p>Donec finibus eros diam, lacinia dignissim lacus sagittis eget.</p>
      </Header>
      <Features>
        <Item>
          <Monitoring />
          <h2>Activity Monitoring</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam.
          </p>
        </Item>
        <Item>
          <Discussion />
          <h2>Group Discussion</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam.
          </p>
        </Item>
        <Item>
          <Task />
          <h2>Task Management</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam.
          </p>
        </Item>
        <Item>
          <Meeting />
          <h2>Meeting Room</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam.
          </p>
        </Item>
        <Item>
          <Github />
          <h2>GitHub Integration</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus eros diam.
          </p>
        </Item>
      </Features>
    </Container>
  );
};

const Container = styled.div`
  min-height: 110vh;
  background-color: ${setColor.primary};
`;

const Header = styled.div`
  padding: 50px 0;
  text-align: center;
  h1 {
    color: ${setColor.mainWhite};
    font-weight: 600;
    font-size: ${setRem(40)};
    margin-bottom: 10px;
  }
  p {
    color: ${setColor.mainGrey};
    font-size: ${setRem(20)};
    font-weight: 400;
    margin: 0 35%;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-areas:
    'monitoring discussion discussion task'
    'meeting meeting github github';
  grid-template-columns: repeat(4, 20%);
  margin: 0 5%;
  justify-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 50px;
`;

const Item = styled.div`
  margin: 10px 0;
  svg {
    width: 100px;
  }
  h2 {
    color: ${setColor.mainWhite};
    font-weight: 500;
  }
  p {
    color: ${setColor.mainGrey};
    font-weight: 400;
    margin: 10px 0;
  }
  &:nth-child(1) {
    grid-area: monitoring;
  }
  &:nth-child(2) {
    grid-area: discussion;
    padding: 0px 120px;
  }
  &:nth-child(3) {
    grid-area: task;
  }
  &:nth-child(4) {
    grid-area: meeting;
    padding: 0px 120px;
  }
  &:nth-child(5) {
    grid-area: github;
    padding: 0px 120px;
  }
`;

export default About;

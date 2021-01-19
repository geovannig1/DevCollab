import React from 'react';

import styled from 'styled-components';
import { setRem, setColor } from '../../styles';
import { ReactComponent as Monitoring } from './monitoring.svg';
import { ReactComponent as Task } from './task.svg';
import { ReactComponent as Meeting } from './meeting.svg';
import { ReactComponent as Github } from './github.svg';

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
    margin: 0 500px;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 0 100px;
  justify-items: center;
  text-align: center;
  padding-bottom: 50px;
`;

const Item = styled.div`
  padding: 15px 150px;
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
`;

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

export default About;

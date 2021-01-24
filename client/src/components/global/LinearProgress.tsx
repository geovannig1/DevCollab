import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { setColor } from '../../styles';

const Spinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 25;
        const diff2 = Math.random() * 25;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
    },
  });

  return (
    <Container>
      <StyledLogo />
      <ThemeProvider theme={theme}>
        <StyledProgress
          variant='buffer'
          value={progress}
          valueBuffer={buffer}
        />
      </ThemeProvider>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${setColor.mainGrey};
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLogo = styled(Logo)`
  margin: 20px;
  height: 25%;
  width: 25%;
`;

const StyledProgress = styled(LinearProgress)`
  width: 20%;
`;

export default Spinner;

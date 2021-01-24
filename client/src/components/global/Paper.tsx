import React from 'react';
import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { setColor, setShadow } from '../../styles';

interface PaperProps {
  title: string;
  description?: string;
}

const Paper: React.FC<PaperProps> = ({ title, description }) => {
  const classes = useStyles();
  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <StyledIcon className={classes.root} fontSize='large' />
      </Header>
      <Description>{description}</Description>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${setColor.mainWhite};
  width: 250px;
  height: 300px;
  cursor: pointer;
  padding: 20px;
  word-wrap: break-word;
  box-shadow: ${setShadow.main};
  border-radius: 10px;
  transition: 0.2s ease-in-out;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
`;

const Header = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h4`
  color: ${setColor.primary};
  font-weight: 600;
`;

const StyledIcon = styled(MoreHorizIcon)`
  color: ${setColor.secondary};
  transition: 0.2s ease-in-out;
  &:hover {
    color: ${setColor.primary};
  }
  &:active {
    color: ${setColor.secondary};
  }
`;

const Description = styled.p`
  color: ${setColor.mainBlack};
`;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      transition: '0.2s ease-in-out',
    },
  })
);

export default Paper;

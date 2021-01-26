import React from 'react';
import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { setColor, setShadow } from '../../styles';

interface CardProps {
  title: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
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
  user-select: none;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
  &:active {
    box-shadow: ${setShadow.main};
  }
`;

const Header = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h4`
  color: ${setColor.mainBlack};
  font-weight: 600;
`;

const StyledIcon = styled(MoreHorizIcon)`
  color: ${setColor.lightBlack};
  transition: 0.2s ease-in-out;
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
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

export default Card;

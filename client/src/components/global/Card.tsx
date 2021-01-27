import React from 'react';
import styled from 'styled-components';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { setColor, setShadow } from '../../styles';
import CardMenu from './CardMenu';

interface CardProps {
  title: string;
  description?: string;
  deleteTitle: string;
  deleteText: string;
  deleteItem: (id: number) => Promise<void>;
  deleteId: number;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  deleteTitle,
  deleteText,
  deleteId,
  deleteItem,
}) => {
  const classes = useStyles();
  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <CardMenu
          deleteItem={deleteItem}
          deleteId={deleteId}
          deleteTitle={deleteTitle}
          deleteText={deleteText}
        >
          <StyledIcon className={classes.root} fontSize='large' />
        </CardMenu>
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

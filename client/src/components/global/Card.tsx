import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  editLink: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  deleteTitle,
  deleteText,
  deleteId,
  deleteItem,
  editLink,
}) => {
  const classes = useStyles();
  return (
    <Fragment>
      <StyledLink to='/'>
        <Container>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Container>
      </StyledLink>
      <MenuContainer>
        <CardMenu
          deleteItem={deleteItem}
          deleteId={deleteId}
          deleteTitle={deleteTitle}
          deleteText={deleteText}
          editLink={editLink}
        >
          <StyledIcon className={classes.root} fontSize='large' />
        </CardMenu>
      </MenuContainer>
    </Fragment>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Container = styled.div`
  background-color: ${setColor.mainWhite};
  position: relative;
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

const Title = styled.h4`
  color: ${setColor.mainBlack};
  font-weight: 600;
  margin-bottom: 15px;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 25px;
  margin-top: 10px;
  cursor: pointer;
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

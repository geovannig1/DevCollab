import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { setColor, setShadow } from '../../styles';
import CardMenu from './CardMenu';
import { AccessPermission, Member } from '../../actions/projectTypes';
import { UserType } from '../../actions/authTypes';

interface CardProps {
  projectId: number;
  title: string;
  description?: string;
  deleteTitle: string;
  deleteText: string;
  deleteItem: (id?: number) => Promise<void>;
  link: string;
  editLink: string;
  members?: Member[];
  user?: UserType;
}

const Card: React.FC<CardProps> = ({
  projectId,
  title,
  description,
  deleteTitle,
  deleteText,
  deleteItem,
  link,
  editLink,
  members,
  user,
}) => {
  const classes = useStyles();

  //Find user in the project
  const findUser = members?.find((member) => member.user._id === user?._id);

  return (
    <Fragment>
      <StyledLink to={link}>
        <Container>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Container>
      </StyledLink>

      {findUser?.accessPermission === AccessPermission.Admin && (
        <MenuContainer>
          <CardMenu
            deleteItem={deleteItem}
            deleteId={projectId}
            deleteTitle={deleteTitle}
            deleteText={deleteText}
            editLink={editLink}
          >
            <HorizIcon className={classes.root} fontSize='large' />
          </CardMenu>
        </MenuContainer>
      )}
    </Fragment>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  outline: none;
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
  border-radius: 8px;
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

const HorizIcon = styled(MoreHorizIcon)`
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

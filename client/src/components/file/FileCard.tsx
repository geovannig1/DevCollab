import React from 'react';
import styled from 'styled-components';
import day from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CardMenu from '../global/CardMenu';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setColor, setShadow, setRem } from '../../styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { NoteTypes } from '../../actions/noteTypes';
import { deleteNote } from '../../actions/noteActions';

interface FileCardProps {
  projectId: string;
}

const FileCard: React.FC<FileCardProps> = ({ projectId }) => {
  //extends relativetime
  day.extend(relativeTime);

  return (
    <Container>
      <StyledLink to={`/projects/${projectId}/notes/${''}`}>
        <CardContainer>
          <Title>Supp</Title>
          <Content>
            <Creator>By John doe</Creator>
            <Date>{day().fromNow()}</Date>
          </Content>
        </CardContainer>
      </StyledLink>
      <MenuContainer>
        <CardMenu
          deleteTitle='Delete File'
          deleteText={`Are you sure want to delete ${''} file? this process can't be undone.`}
          deleteItem={() => {}}
          editLink={`/`}
        >
          <StyledHoriz fontSize='large' />
        </CardMenu>
      </MenuContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100px;
  width: 250px;
  position: relative;
`;

const StyledLink = styled(Link)`
  color: ${setColor.mainBlack};
  text-decoration: none;
  outline: none;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  height: 100%;
  background-color: ${setColor.mainWhite};
  border-radius: 8px;
  box-shadow: ${setShadow.main};
  transition: 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
  &:active {
    box-shadow: ${setShadow.main};
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  margin-right: 10px;
  cursor: pointer;
`;

const Title = styled.h4`
  font-weight: 600;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
`;

const Creator = styled.span`
  font-weight: 500;
  font-size: ${setRem(14)};
`;

const Date = styled.span`
  font-size: ${setRem(12)};
`;

const StyledHoriz = styled(MoreHorizIcon)`
  cursor: pointer;
  color: ${setColor.lightBlack};
  transition: 0.2s ease-in-out;
  &:hover {
    transition: 0.2s ease-in-out;
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default FileCard;

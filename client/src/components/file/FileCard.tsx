import React, { Fragment } from 'react';
import styled from 'styled-components';
import day from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CardMenu from '../global/CardMenu';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setColor, setShadow, setRem } from '../../styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { FileTypes } from '../../actions/fileTypes';
import { deleteFile } from '../../actions/fileActions';
import { Store } from '../../store';
import { AuthInitialState } from '../../reducers/authReducer';
import { ProjectInitialState } from '../../reducers/projectReducer';
import { AccessPermission } from '../../actions/projectTypes';
import socket from '../../utils/socketio';

interface FileCardProps {
  deleteFile: (projectId: string, fileId: string) => Promise<void>;
  projectId: string;
  file: FileTypes;
  auth: AuthInitialState;
  project: ProjectInitialState;
}

const FileCard: React.FC<FileCardProps> = ({
  deleteFile,
  projectId,
  file,
  auth: { user },
  project: { selectedProject },
}) => {
  //extends relativetime
  day.extend(relativeTime);

  const handleDelete = () => {
    deleteFile(projectId, file._id ?? '');
    socket.emit('delete activity file', {
      projectId,
      userName: `${user?.firstName} ${user?.lastName}`,
      fileName: file.name,
      userId: user?._id,
    });
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Fragment>
      <Container>
        <Link
          target='_blank'
          rel='noopener noreferrer'
          href={`${file.file.url}`}
        >
          <CardContainer>
            <Title>{file.name}</Title>
            <Content>
              <Creator>By {file.user?.firstName}</Creator>
              <Date>{day(file.date).fromNow()}</Date>
            </Content>
          </CardContainer>
        </Link>
        {userProject?.accessPermission !== AccessPermission.ReadOnly && (
          <MenuContainer>
            <CardMenu
              deleteTitle='Delete File'
              deleteText={`Are you sure want to delete ${file.name} file? this process can't be undone.`}
              deleteItem={handleDelete}
              editLink={`/projects/${projectId}/files/${file._id}`}
            >
              <StyledHoriz fontSize='large' />
            </CardMenu>
          </MenuContainer>
        )}
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  deleteFile: (projectId: string, fileId: string) =>
    dispatch(deleteFile(projectId, fileId)),
});

const Container = styled.div`
  height: 100px;
  width: 250px;
  position: relative;
`;

const Link = styled.a`
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

export default connect(mapStateToProps, mapDispatchToProps)(FileCard);

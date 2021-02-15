import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setColor, setShadow } from '../../styles';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import VideocamIcon from '@material-ui/icons/Videocam';
import GitHubIcon from '@material-ui/icons/GitHub';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SettingsIcon from '@material-ui/icons/Settings';
import { Store } from '../../store';
import { NavbarInitialState } from '../../reducers/navbarReducer';
import { SelectedType } from '../../actions/navbarTypes';
import { ProjectInitialState } from '../../reducers/projectReducer';

interface NavbarProps {
  navbar: NavbarInitialState;
  project: ProjectInitialState;
}

const Navbar: React.FC<NavbarProps> = ({
  navbar,
  project: { selectedProject },
}) => {
  return (
    <Container>
      <StyledLink
        to={`/projects/${selectedProject?._id}/activity`}
        selected={navbar.selected === SelectedType.Activity}
      >
        <ImportExportIcon />
        <Text>Activity</Text>
        <div />
      </StyledLink>

      <StyledLink
        to={`/projects/${selectedProject?._id}/tasks`}
        selected={navbar.selected === SelectedType.Task}
      >
        <PlaylistAddCheckIcon />
        <Text>Tasks</Text>
        <div />
      </StyledLink>

      <StyledLink
        to={`/projects/${selectedProject?._id}/discussions`}
        selected={navbar.selected === SelectedType.Discussions}
      >
        <QuestionAnswerIcon />
        <Text>Discussions</Text>
        <div />
      </StyledLink>

      <StyledLink
        to={`/projects/${selectedProject?._id}/meeting-rooms`}
        selected={navbar.selected === SelectedType.Meeting}
      >
        <VideocamIcon />
        <Text>Meeting Rooms</Text>
        <div />
      </StyledLink>

      <StyledLink to='#' selected={navbar.selected === SelectedType.Github}>
        <GitHubIcon />
        <Text>GitHub Activity</Text>
        <div />
      </StyledLink>

      <StyledLink to='#' selected={navbar.selected === SelectedType.Notes}>
        <NoteAddIcon />
        <Text>Notes</Text>
        <div />
      </StyledLink>

      <StyledLink to='#' selected={navbar.selected === SelectedType.Files}>
        <AttachFileIcon />
        <Text>Files</Text>
        <div />
      </StyledLink>

      <StyledLink to='#'>
        <SettingsIcon />
        <Text>Settings</Text>
        <div />
      </StyledLink>
    </Container>
  );
};

const mapStateToProps = (state: Store) => ({
  navbar: state.navbar,
  project: state.project,
});

const Container = styled.nav`
  display: flex;
  justify-content: space-evenly;
  background-color: ${setColor.mainWhite};
  box-shadow: ${setShadow.main};
  width: 100%;
  height: 70px;
  margin: 20px 0;
  border-radius: 10px;
`;

const StyledLink = styled(Link)<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  outline: none;
  user-select: none;
  color: ${({ selected }) =>
    selected ? setColor.primaryDark : setColor.lightBlack};
  transition: 0.2s ease-in-out;

  div {
    transition: 0.2s ease-in-out;
    width: 100%;
    border-top: ${({ selected }) =>
        selected ? setColor.primaryDark : setColor.mainWhite}
      3px solid;
  }

  &:hover {
    color: ${({ selected }) => !selected && setColor.primary};
  }
`;

const Text = styled.span`
  font-weight: 600;
`;

export default connect(mapStateToProps)(Navbar);

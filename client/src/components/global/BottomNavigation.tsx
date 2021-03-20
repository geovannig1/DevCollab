import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Store } from '../../store';
import Nav from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import VideocamIcon from '@material-ui/icons/Videocam';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { setColor, setShadow } from '../../styles';
import { SelectedType } from '../../actions/navbarTypes';
import { NavbarInitialState } from '../../reducers/navbarReducer';
import { ProjectInitialState } from '../../reducers/projectReducer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GitHubIcon from '@material-ui/icons/GitHub';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SettingsIcon from '@material-ui/icons/Settings';

interface BottomNavigationProps {
  navbar: NavbarInitialState;
  project: ProjectInitialState;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  navbar,
  project: { selectedProject },
}) => {
  const classes = useStyles();
  const history = useHistory();

  //Handle the bottom navigation change event
  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | string
  ) => {
    switch (newValue) {
      case SelectedType.Activity:
        history.push(`/projects/${selectedProject?._id}/activity`);
        break;
      case SelectedType.Task:
        history.push(`/projects/${selectedProject?._id}/tasks`);
        break;
      case SelectedType.Discussions:
        history.push(`/projects/${selectedProject?._id}/discussions`);
        break;
      case SelectedType.Meeting:
        history.push(`/projects/${selectedProject?._id}/meeting-rooms`);
        break;
      case 'more':
        setMobileOpen(!mobileOpen);
        break;
    }
  };

  const handleSidebarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    switch (e.currentTarget.id) {
      case 'github':
        history.push(`/projects/${selectedProject?._id}/github-activity`);
        break;
      case 'notes':
        history.push(`/projects/${selectedProject?._id}/notes`);
        break;
      case 'files':
        history.push(`/projects/${selectedProject?._id}/files`);
        break;
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Fragment>
      <StyledNav value={navbar.selected} onChange={handleChange} showLabels>
        <BottomNavigationAction
          label='Activity'
          value={SelectedType.Activity}
          icon={<ImportExportIcon />}
        />
        <BottomNavigationAction
          label='Tasks'
          value={SelectedType.Task}
          icon={<PlaylistAddCheckIcon />}
        />
        <BottomNavigationAction
          label='Discussions'
          value={SelectedType.Discussions}
          icon={<QuestionAnswerIcon />}
        />
        <BottomNavigationAction
          label='Meetings'
          value={SelectedType.Meeting}
          icon={<VideocamIcon />}
        />
        <BottomNavigationAction
          label='More'
          value='more'
          icon={<MoreHorizIcon />}
        />
      </StyledNav>

      {/* Right sidebar */}
      <SwipeableDrawer
        variant='temporary'
        anchor='right'
        open={mobileOpen}
        onOpen={handleDrawerToggle}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List>
          <ListItem
            button
            id='github'
            onClick={handleSidebarClick}
            selected={navbar.selected === SelectedType.Github}
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary='Github' />
          </ListItem>
          <ListItem
            button
            id='notes'
            onClick={handleSidebarClick}
            selected={navbar.selected === SelectedType.Notes}
          >
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary='Notes' />
          </ListItem>
          <ListItem
            button
            id='files'
            onClick={handleSidebarClick}
            selected={navbar.selected === SelectedType.Files}
          >
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText primary='Files' />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  navbar: state.navbar,
  project: state.project,
});

const StyledNav = styled(Nav)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  background-color: ${setColor.mainWhite};
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: 150,
      backgroundColor: setColor.mainWhite,
      boxShadow: setShadow.main,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 10,
    },
  })
);

export default connect(mapStateToProps)(BottomNavigation);

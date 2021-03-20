import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { setColor, setShadow } from '../../styles';
import ProfileSidebar from '../sidebar/ProfileSidebar';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import CalendarSidebar from './CalendarSidebar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.drawer}>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        edge='start'
        onClick={handleDrawerToggle}
        className={classes.menuButton}
      >
        <MenuIcon fontSize='large' />
      </IconButton>
      <Hidden smUp implementation='css'>
        <SwipeableDrawer
          variant='temporary'
          anchor='left'
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
          <StyledLink to='/projects'>
            <StyledLogo />
          </StyledLink>
          <ProfileSidebar />
          <CalendarSidebar />
        </SwipeableDrawer>
      </Hidden>

      <Hidden mdDown implementation='css'>
        <Drawer
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          open
        >
          <StyledLink to='/projects'>
            <StyledLogo />
          </StyledLink>
          <ProfileSidebar />
          <CalendarSidebar />
        </Drawer>
      </Hidden>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: 330,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: 330,
      backgroundColor: setColor.mainWhite,
      boxShadow: setShadow.main,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 10,
    },
    menuButton: {
      position: 'fixed',
      bottom: 20,
      left: 20,
      zIndex: 10,
      color: setColor.mainWhite,
      backgroundColor: setColor.secondary,
      '&:hover': {
        backgroundColor: setColor.secondaryDark,
      },
      [theme.breakpoints.down('sm')]: {
        bottom: 65,
        left: 20,
      },
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
  })
);

const StyledLogo = styled(Logo)`
  width: 180px;
  margin: 4px 20px;
  user-select: none;
`;

const StyledLink = styled(Link)`
  outline: none;
`;

export default Sidebar;

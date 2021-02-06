import React from 'react';
import Menu from '@material-ui/core/Menu';

interface CoreMenuProps {}

const CoreMenu: React.FC<CoreMenuProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      autoFocus={false}
      id='simple-menu'
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {children}
    </Menu>
  );
};

export default CoreMenu;

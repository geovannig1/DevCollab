import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import AlertDialog from './AlertDialog';
import EditListMenu from '../task/EditListMenu';
import { UserType } from '../../actions/authTypes';

interface CardMenuProps {
  deleteItem: (id?: string) => Promise<void> | void;
  deleteId?: string;
  editLink?: string;
  deleteTitle: string;
  deleteText: string;
  listTitle?: string;
  listId?: string;
  user?: UserType;
}

const CardMenu: React.FC<CardMenuProps> = ({
  children,
  deleteItem,
  deleteId,
  deleteTitle,
  deleteText,
  editLink,
  listTitle,
  listId,
  user,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        {children}
      </Button>

      <Menu
        autoFocus={false}
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {editLink ? (
          <StyledLink to={editLink}>
            <MenuItem onClick={handleClose}>Edit</MenuItem>
          </StyledLink>
        ) : (
          <EditListMenu
            listTitle={listTitle ?? ''}
            listId={listId ?? ''}
            user={user}
          >
            <MenuItem onClick={handleClose}>Edit</MenuItem>
          </EditListMenu>
        )}
        <AlertDialog
          deleteItem={deleteItem}
          deleteId={deleteId}
          deleteButton
          title={deleteTitle}
          text={deleteText}
          firstButton='Delete'
          secondButton='Cancel'
        >
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </AlertDialog>
      </Menu>
    </div>
  );
};

const Button = styled.button`
  background: none;
  cursor: pointer;
  border: none;
  outline: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default CardMenu;

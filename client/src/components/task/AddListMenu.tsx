import React from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { setColor, setShadow } from '../../styles';

interface AddListMenuProps {}

const AddListMenu: React.FC<AddListMenuProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <StyledButton onClick={handleClickOpen}>{children}</StyledButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogContent>
          <TextField
            autoFocus
            margin='normal'
            id='name'
            label='List Name'
            type='text'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  height: 35px;
  border: none;
  outline: none;
  font-weight: 600;
  cursor: pointer;
  background-color: ${setColor.primary};
  box-shadow: ${setShadow.main};
  color: ${setColor.mainWhite};
  border-radius: 10px;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${setColor.primaryDark};
  }
  &:active {
    background-color: ${setColor.primary};
  }
`;

export default AddListMenu;

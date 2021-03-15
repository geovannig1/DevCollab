import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { setColor, setShadow } from '../../styles';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface AddListMenuProps {
  setProgress: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UserType;
}

const AddListMenu: React.FC<AddListMenuProps> = ({
  children,
  user,
  setProgress,
}) => {
  const [open, setOpen] = React.useState(false);
  const [listData, setListData] = useState('');

  const { projectId } = useParams<{ projectId: string }>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setListData('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListData(e.target.value);
  };

  const handleClick = () => {
    if (listData !== '') {
      setProgress(true);
      socket.emit('create list', { projectId, listData });

      //Handle activity report
      socket.emit('create activity list', {
        projectId,
        listName: listData,
        userName: `${user?.firstName} ${user?.lastName}`,
        userId: user?._id,
      });

      handleClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledButton onClick={handleClickOpen}>{children}</StyledButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogContent>
          <TextField
            autoFocus
            color='primary'
            margin='normal'
            id='name'
            label='List Title'
            type='text'
            fullWidth
            autoComplete='off'
            onChange={handleChange}
            value={listData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClick} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: setColor.primary,
    },
  },
});

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

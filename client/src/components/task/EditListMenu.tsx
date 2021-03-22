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
import { setColor } from '../../styles';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface EditListMenuProps {
  setProgress?: React.Dispatch<React.SetStateAction<boolean>>;
  listTitle: string;
  listId: string;
  user?: UserType;
}

const EditListMenu: React.FC<EditListMenuProps> = ({
  children,
  setProgress,
  listTitle,
  listId,
  user,
}) => {
  const [open, setOpen] = React.useState(false);
  const [listData, setListData] = useState(listTitle);

  const { projectId } = useParams<{ projectId: string }>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setListData(listTitle);
    setOpen(false);
  };

  //CLose updated data
  const handleCloseUpdated = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListData(e.target.value);
  };

  const handleClick = () => {
    setProgress && setProgress(true);
    socket.emit('update list', { projectId, listData, listId });

    //Handle activity report
    socket.emit('update activity list', {
      projectId,
      userName: `${user?.firstName} ${user?.lastName}`,
      listName: listData,
      previousListName: listTitle,
      userId: user?._id,
    });
    handleCloseUpdated();
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
            Edit
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
  border: none;
  background: none;
  width: 100%;
`;

export default EditListMenu;

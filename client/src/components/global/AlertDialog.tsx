import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';

interface AlertDialogProps {
  deleteItem?: (id?: number) => Promise<void>;
  deleteId?: number;
  deleteButton?: boolean;
  title: string;
  text: string;
  secondButton: string;
  firstButton: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  deleteItem,
  deleteId,
  children,
  deleteButton,
  title,
  text,
  firstButton,
  secondButton,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      if (deleteId) deleteItem(deleteId);
      else deleteItem();
    }
    handleClose();
  };

  return (
    <div>
      <StyledButton onClick={handleClickOpen}>{children}</StyledButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='default'>
            {secondButton}
          </Button>
          <Button
            onClick={handleDelete}
            color={deleteButton ? 'secondary' : 'primary'}
          >
            {firstButton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const StyledButton = styled.button`
  background: none;
  cursor: pointer;
  border: none;
  outline: none;
`;

export default AlertDialog;

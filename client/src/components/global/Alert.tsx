import React, { useState } from 'react';
import AlertComponent from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';

import { Store } from '../../store';
import { AlertInitialState } from '../../reducers/alertReducer';

interface AlertProps {
  alerts: AlertInitialState;
  message: string;
  messageType: boolean;
}

const Alert: React.FC<AlertProps> = ({ alerts, messageType, message }) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <AlertComponent
        color={messageType ? 'success' : 'error'}
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      >
        {message}
      </AlertComponent>
    </Collapse>
  );
};

const mapStateToProps = (state: Store) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);

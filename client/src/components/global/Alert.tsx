import React, { useState, useEffect, Fragment } from 'react';
import AlertComponent from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Store } from '../../store';
import { removeAlert } from '../../actions/alertActions';
import { AlertInitialState, AlertType } from '../../reducers/alertReducer';

interface AlertProps {
  alerts: AlertInitialState;
  removeAlert: (location?: string) => void;
}

const Alert: React.FC<AlertProps> = ({ alerts, removeAlert }) => {
  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);

  //Show unique alerts
  const [results, setResults] = useState<AlertInitialState>([]);
  useEffect(() => {
    const result = [];
    const map = new Map();
    for (const item of alerts) {
      if (!map.has(item.location)) {
        map.set(item.location, false);
        result.push({
          location: item.location,
          message: item.message,
          messageType: item.messageType,
        });
      }

      setResults(result);
    }
  }, [alerts]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {alerts.length > 0 &&
        results.map((result: AlertType, index) => (
          <Collapse in={true} key={index}>
            <AlertComponent
              color={result.messageType ? 'success' : 'error'}
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    removeAlert(result.location);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              {result.message}
            </AlertComponent>
          </Collapse>
        ))}
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  alerts: state.alert,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  removeAlert: (location?: string) => dispatch(removeAlert(location)),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export default connect(mapStateToProps, mapDispatchToProps)(Alert);

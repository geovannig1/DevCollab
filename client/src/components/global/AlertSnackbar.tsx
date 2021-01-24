import React, { Fragment, useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Store } from '../../store';
import { removeAlert } from '../../actions/alertActions';
import { AlertInitialState } from '../../reducers/alertReducer';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

interface AlertSnackbarProps {
  alerts: AlertInitialState;
  removeAlert: (location?: string) => void;
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  alerts,
  removeAlert,
}) => {
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
  const handleClose = (event: any) => {
    removeAlert(event.location);
  };

  return (
    <Fragment>
      {alerts.length > 0 &&
        results.map((result, index) => (
          <div key={index} className={classes.root}>
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={(result) => handleClose(result)}
            >
              <Alert severity={result.messageType ? 'success' : 'error'}>
                {result.message}
              </Alert>
            </Snackbar>
          </div>
        ))}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  alerts: state.alert,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  removeAlert: (location?: string) => dispatch(removeAlert(location)),
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default connect(mapStateToProps, mapDispatchToProps)(AlertSnackbar);

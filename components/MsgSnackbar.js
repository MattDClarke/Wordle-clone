import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

function TransitionDown(props) {
  // eslint-disable-next-line
    return <Slide {...props} direction="down" />;
}

export default function MsgSnackbar({
  msgType,
  msg,
  autoHideDuration,
  countMsgs,
  countSuccessMsgs,
}) {
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [transition, setTransition] = useState(undefined);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
    setMessage('');
  };

  // only set and open message when msg changes
  useEffect(() => {
    if (msg === null || msg === undefined || msg === '') return;
    setMessage(msg, countMsgs);
    setTransition(() => TransitionDown);
    setOpenMessage(true);
    // also set and open if msg count changes -> same msg shown twice.
  }, [msg, countMsgs]);

  // only set and open message when success count or msg changes
  // for case where potentially multiple success msg on same page sequentially
  useEffect(() => {
    if (msg === null || msg === undefined || msg === '') return;
    setMessage(msg);
    setTransition(() => TransitionDown);
    setOpenMessage(true);
    // also set and open if msg count changes
  }, [msg, countSuccessMsgs]);

  return (
    <Snackbar
      open={openMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      TransitionComponent={transition}
    >
      <Alert onClose={handleClose} severity={msgType}>
        {message}
      </Alert>
    </Snackbar>
  );
}

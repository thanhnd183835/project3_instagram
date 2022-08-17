import { Button, Box, makeStyles } from '@material-ui/core';
import React from 'react';
import Popup from '../Popup/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { hideModalMessage } from '../../redux/message/message.slice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const ModalMessage = () => {
  const useStyles = makeStyles(() => {
    return {
      modal: {
        textAlign: 'center',

        '& .modal-container': {
          paddingBottom: 51,
        },

        '& button': {
          margin: '20px auto 0',
          minWidth: 126,
        },
      },

      styleModal: {
        fontSize: 20,
        color: '#262626',

        '@media (max-width: 767px)': {
          fontSize: 18,
        },
      },
    };
  });

  const styles = useStyles();

  const dispatch = useDispatch();
  const { show, type, msg, onOk } = useSelector((state) => state.message.modal);

  //   console.log(messageState);
  return (
    <Popup
      className={styles.modal}
      isOpen={show}
      handleClose={() => {
        dispatch(hideModalMessage());
      }}
      isIconClose={false}
      title="Message"
    >
      <Box textAlign="center" className={styles.styleModal}>
        <div
          style={{
            marginBottom: 10,
            fontSize: 20,
          }}
        >
          {/* {type === 'SUCCESS' ? <img src={success} alt="success" /> : <img src={error} alt="error" />} */}
          {type === 'SUCCESS' ? (
            <CheckCircleIcon style={{ fontSize: '60px', marginTop: '10px', color: '#0095f6' }} />
          ) : (
            <HighlightOffIcon style={{ fontSize: '60px', marginTop: '10px', color: 'red' }} />
          )}
        </div>
        <div>{msg}</div>
        <Button
          height={'36px'}
          onClick={() => (onOk ? onOk() : dispatch(hideModalMessage()))}
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            background: '#0095f6',
            width: '60px',
            borderRadius: '12px',
          }}
        >
          OK
        </Button>
      </Box>
    </Popup>
  );
};

export default ModalMessage;

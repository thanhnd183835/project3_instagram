import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { PREVLINK } from '../../ultils/constants';
const ListReport = (props) => {
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const [notifications, setNotifications] = useState(props.notification);

  // console.log(notifications);

  const useStyles = makeStyles({
    reportItems: {
      display: 'flex',
      width: '100%',
      padding: '16px',
      borderBottom: '1px solid #dbdbdb',
      alignItems: 'center',
      fontSize: '16px',
      cursor: 'pointer',
    },
    link: {
      textDecoration: 'none',
      color: '#262626',
    },
  });
  const classes = useStyles();
  const history = useHistory();
  return notifications?.length ? (
    notifications?.map((noti) => {
      if (noti?.post) {
        return (
          <div
            className={classes.reportItems}
            onClick={() => {
              history.push({
                pathname: `/post/${noti?.post?._id}`,
                state: {
                  postId: noti?.post?._id,
                  liked: noti?.post?.likes.find((i) => i.userId === infoUser._id) ? true : false,
                  numberLikes: noti?.post?.likes?.length,
                },
              });
            }}
          >
            <div style={{ marginRight: '20px' }}>
              Tài khoản{' '}
              <strong>
                <Link
                  to={`/profile-friend/${noti?.otherUser?._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={classes.link}
                >
                  {noti?.otherUser?.userName}
                </Link>
              </strong>{' '}
              {noti?.content}
            </div>
            <img alt="element" src={`${PREVLINK}/${noti.post?.pictures[0]?.img}`} height="36" width="36" />
          </div>
        );
      } else {
        return (
          <div
            className={classes.reportItems}
            onClick={() => {
              history.push(`/profile-friend/${noti?.userReport?._id}`);
            }}
          >
            <div style={{ marginRight: '20px' }}>
              Tài khoản{' '}
              <strong>
                <Link
                  to={`/profile-friend/${noti?.otherUser?._id}`}
                  className={classes.link}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {noti?.otherUser?.userName}
                </Link>
              </strong>{' '}
              {noti?.content}
            </div>
            <img alt="element" src={`${PREVLINK}/${noti?.userReport?.avatar}`} height="36" width="36" />
          </div>
        );
      }
    })
  ) : (
    <p>No Reports</p>
  );
};

export default ListReport;

import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import './Navbar.css';
import insta_log from '../../images/logoinsta.png';
import home from '../../images/home.svg';
import react from '../../images/love.svg';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import add from '../../images/add.png';
import reactClick from '../../images/blacklove.png';
import { useHistory } from 'react-router';
import Popup from '../Popup/Popup';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';
import CreatePost from '../CreatePost/CreatePost';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { acceptFollowNotificaion, readNotification } from '../../redux/notification/notification.slice';
import { HOST_URL, PREVLINK } from '../../ultils/constants';
import { getMe, logout } from '../../redux/auth/auth.slice';
import Message from '../../images/message.png';
import { updateCountMess, setIdFriend, initCountMess } from '../../redux/chat/chat.slice';
import { acceptFollowApi } from '../../redux/user/user.slice';
import { showModalMessage } from '../../redux/message/message.slice';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const refAvatar = useRef();
  const refNoti = useRef();
  const history = useHistory();
  const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
  const [toggleAvatar, setToggleAvatar] = useState(false);
  const [toggleNoti, setToggleNoti] = useState(false);
  const [listUser, setListUser] = useState([]);
  const socket = useSelector((state) => state.socket.socket.payload);
  const infoUser = useSelector((state) => state.auth?.user?.data?.data);
  // const notifications = useSelector((state) => state.notification.notification?.data.data);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNoti, setHasNewNoti] = useState(false);
  const countNewMess = useSelector((state) => state.chat?.countNewMess?.length);

  const idFriend = useSelector((state) => state.chat?.idFriend);

  useEffect(() => {
    dispatch(initCountMess());
  }, []);

  useEffect(() => {
    socket?.on('get_message', async (data) => {
      if (infoUser._id === data.idFriend) {
        console.log('push mess --------------------------------');
        dispatch(setIdFriend(data.idMe));
        dispatch(updateCountMess({ userId: data.idMe, action: 'PUSH' }));
      }
    });
  }, [socket]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('persist:root');
    localStorage.removeItem('token');
    history.push('/login');
  };
  const showNumberNotification = () => {
    return notifications?.filter((item) => {
      return item.status === 0;
    }).length;
  };

  const fetchNotification = async () => {
    axios({
      method: 'get',
      url: `${HOST_URL}/api/notification/get`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then((response) => {
      if (response.status === 200) {
        setNotifications(response.data.data);
      }
    });
  };

  const addPost = () => {
    setIsOpenCreatePost(true);
  };
  const handleClose = () => {
    setIsOpenCreatePost(false);
  };

  const fetchDataUser = (name) => {
    axios({
      method: 'get',
      url: `${HOST_URL}/api/user/search?name=${name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then((response) => {
      if (response.status === 200) {
        setListUser(response?.data?.data);
      }
    });
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (toggleAvatar && refAvatar.current && !refAvatar.current.contains(e.target)) {
        setToggleAvatar(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [toggleAvatar]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (toggleNoti && refNoti.current && !refNoti.current.contains(e.target)) {
        setToggleNoti(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [toggleNoti]);

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      // console.log('value', e.target.value);
    }
  };

  useEffect(() => {
    fetchNotification();
    // dispatch(getMe());
    // if (infoUser?.status === 2) {
    //   handleLogout();
    // }
  }, []);

  useEffect(() => {
    console.log('Notification');
    socket?.on('getNoti', async (data) => {
      if (infoUser?.userName === data?.userNameCreatePost) {
        await fetchNotification();
      }
      if (infoUser.status === 1) {
        await dispatch(getMe());
      }
    });
  }, [socket]);

  useEffect(() => {
    if (showNumberNotification() > 0) {
      setHasNewNoti(true);
    }
  }, [notifications]);

  console.log('countNewMess: ', countNewMess);

  const handleAccept = async (idUser, userName) => {
    const res = await dispatch(acceptFollowApi(idUser));

    console.log(res);

    if (!res.payload) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Có lỗi xảy ra, có thể người gửi đã xóa yêu cầu này!',
        }),
      );
      return;
    }

    if (res?.payload?.data?.code === 0) {
      await dispatch(acceptFollowNotificaion(idUser));
      const data = {
        idUser: idUser,
        userNameCreatePost: userName,
      };
      socket?.emit('accept_follow_user', data);
    }
  };
  return (
    <>
      <div style={{ zIndex: '999', width: '100%', position: 'fixed' }}>
        {infoUser?.role === 1 ? (
          <AppBar position="absolute" className={clsx(classes.appBar)}>
            <Toolbar className={classes.toolbar}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
                onClick={() => history.push('/')}
              >
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
        ) : (
          <div className="navbar__barContent">
            <Grid container>
              <Grid item xs={2}>
                {' '}
              </Grid>
              <Grid item xs={3}>
                <a href="/">
                  {' '}
                  <img className="navbar_logo" alt="element" src={insta_log} width="105px" />
                </a>
              </Grid>
              <Grid item xs={3}>
                {/* <input text="text" className="navbar__searchBar" placeholder="Search" /> */}
                <Autocomplete
                  className="navbar__searchBar__container"
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={listUser?.map((option) => option)}
                  // getOptionLabel={(option) => option.userName && option.fullName}
                  filterOptions={(options, state) => options}
                  renderOption={(object, option) => {
                    return (
                      <div
                        className="search__dropdown_item"
                        onClick={() => {
                          if (option._id === infoUser._id) {
                            history.push({
                              pathname: `/profile`,
                            });
                          } else {
                            history.push({
                              pathname: `/profile-friend/${option._id}`,
                            });
                          }
                        }}
                      >
                        <Avatar src={`${PREVLINK}/${option.avatar}`} className="search__dropdown_item_avatar" />
                        <div>
                          <p className="search__dropdown_item_username">{option.userName}</p>
                          <p className="search__dropdown_item_fullname">{option.fullName}</p>
                        </div>
                      </div>
                    );
                  }}
                  onInputChange={async (e) => {
                    await fetchDataUser(e.target.value);
                    if (e.target.value === '') {
                      setListUser([]);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      // onKeyDown={(e) => {
                      //   if (e.keyCode === 13) {
                      //     history.push('/suggest-detail', { name: 'dat' });
                      //   }
                      // }}
                      type="text"
                      autoComplete="off"
                      className="navbar__searchBar"
                      {...params}
                      placeholder="Tìm kiếm"
                      InputProps={{
                        ...params.InputProps,
                      }}
                      variant="outlined"
                      // onChange={handleSearch}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      onKeyDown={keyPress}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3} className="navbar__img__container">
                <a href="/">
                  <img className="navbar__img" alt="element" src={home} width="25px" height="25px" />
                </a>
                <img
                  className="navbar__img"
                  alt="element"
                  src={add}
                  width="25px"
                  height="25px"
                  style={{ borderRadius: '1px' }}
                  onClick={addPost}
                />
                <div className="dropdown">
                  <img
                    className="navbar__img"
                    style={{ width: '24px', height: '24px' }}
                    src={Message}
                    onClick={() => {
                      // history.push(`/inbox/${idFriend}`);
                      history.push(`/inbox/default`);
                    }}
                    alt="element"
                  ></img>
                  {countNewMess > 0 && <div className="navbar__number__noti">{countNewMess}</div>}
                </div>
                {
                  <div className="dropdown" ref={refNoti}>
                    {!toggleNoti ? (
                      <img
                        className="navbar__img"
                        src={react}
                        alt="element"
                        width="25px"
                        height="25px"
                        onClick={async () => {
                          setToggleNoti(!toggleNoti);
                          if (hasNewNoti) {
                            setHasNewNoti(false);
                            await dispatch(readNotification());
                            fetchNotification();
                          }
                        }}
                      />
                    ) : (
                      <img
                        className="navbar__img"
                        src={reactClick}
                        alt="element"
                        width="25px"
                        height="25px"
                        onClick={() => {
                          setToggleNoti(!toggleNoti);
                        }}
                      />
                    )}
                    {/* <div className="navbar__number__noti">
                    {showNumberNotification() > 0 ? showNumberNotification() : 0}
                  </div> */}
                    {hasNewNoti && <div className="navbar__number__noti">{showNumberNotification()}</div>}
                    {toggleNoti && (
                      <>
                        <div className="dropdown__content__noti">
                          {notifications?.length ? (
                            notifications?.map((noti) => {
                              return (
                                <div
                                  className="noti__component"
                                  onClick={() => {
                                    if (noti?.post) {
                                      history.push({
                                        pathname: `/post/${noti?.post?._id}`,
                                        state: {
                                          postId: noti?.post?._id,
                                          liked: noti?.post?.likes.find((i) => i.userId === infoUser._id)
                                            ? true
                                            : false,
                                          numberLikes: noti?.post?.likes?.length,
                                        },
                                      });
                                    } else {
                                      history.push(`/profile-friend/${noti.otherUser?._id}`);
                                    }
                                    window.location.reload();
                                  }}
                                >
                                  <Avatar
                                    src={`${PREVLINK}/${noti.otherUser?.avatar}`}
                                    style={{ marginRight: '10px' }}
                                  />
                                  <div>
                                    <strong>{noti.otherUser?.userName}</strong>&nbsp;{noti.content}
                                  </div>
                                  {noti.post?.pictures[0]?.img ? (
                                    <img
                                      src={`${PREVLINK}/${noti.post?.pictures[0]?.img}`}
                                      alt="element"
                                      width="30px"
                                      height="30px"
                                      style={{ marginLeft: 'auto' }}
                                    />
                                  ) : (
                                    infoUser?.requests?.length > 0 &&
                                    infoUser?.requests.includes(noti.otherUser?._id) && (
                                      <button
                                        className="btn_accept"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAccept(noti.otherUser?._id, noti.otherUser?.userName);
                                        }}
                                      >
                                        Xác nhận
                                      </button>
                                    )
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p style={{ textAlign: 'center', fontWeight: '600' }}>No notification</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                }
                <div class="dropdown" ref={refAvatar}>
                  <Avatar
                    src={`${PREVLINK}/${infoUser?.avatar}`}
                    className="navbar__img navbar__avatar"
                    style={{ maxWidth: '25px', maxHeight: '25px' }}
                    onClick={() => {
                      setToggleAvatar(!toggleAvatar);
                    }}
                  />
                  {toggleAvatar && (
                    <>
                      <div className="dropdown__content">
                        <div className="dropdown__component">
                          <AccountCircleIcon style={{ marginRight: '10px' }} />
                          <a style={{ color: 'black', textDecoration: 'none' }} href="/profile">
                            Trang cá nhân
                          </a>
                        </div>
                        <div
                          className="dropdown__component"
                          style={{ marginBottom: '10px' }}
                          onClick={() => {
                            history.push('/edit-profile');
                          }}
                        >
                          <SettingsIcon style={{ marginRight: '10px' }} />
                          Cài đặt
                        </div>
                        <div
                          onClick={() => {
                            handleLogout();
                          }}
                          className="dropdown__component"
                        >
                          Đăng xuất
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
          </div>
        )}
      </div>
      {isOpenCreatePost && (
        <Popup isOpen={isOpenCreatePost} handleClose={handleClose} title={'Tạo bài viết mới'} isIconClose={true}>
          <CreatePost handleClose={handleClose} />
        </Popup>
      )}
    </>
  );
};

export default NavBar;

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import ListUser from './ListUser';
import { useState } from 'react';
import { useHistory } from 'react-router';
import ListReport from './ListReport';
import axios from 'axios';
import { HOST_URL } from '../../ultils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { readNotification } from '../../redux/notification/notification.slice';
import ListPostDeleted from './ListPostDeleted';
const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  numberNoti: {
    width: '25px',
    height: '25px',
    borderRadius: '11px',
    color: 'white',
    textAlign: 'center',
    background: 'red',
    fontSize: '18px',
    alignItems: 'center',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket.payload);
  const infoUser = useSelector((state) => state.auth.user.data.data);

  const [notifications, setNotifications] = useState([]);

  const fetchNotification = async () => {
    axios({
      method: 'get',
      url: `${HOST_URL}/api/notification/get`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then((response) => {
      // console.log(response);
      if (response.status === 200) {
        setNotifications(response.data.data);
      }
    });
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    socket?.on('getNoti', async (data) => {
      if (infoUser.userName === data.admin) {
        await fetchNotification();
      }
    });
  }, [socket]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const logout = () => {
    localStorage.removeItem('persist:root');
    localStorage.removeItem('token');
    history.push('/login');
  };

  const showNumberNotification = () => {
    return notifications?.filter((item) => {
      return item.status === 0;
    }).length;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
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
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <div>
            <ListItem
              button
              onClick={() => {
                setTab(1);
              }}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý tài khoản" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setTab(2);
                dispatch(readNotification());
                fetchNotification();
              }}
            >
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Danh sách báo cáo" />
              {showNumberNotification() > 0 && <div className={classes.numberNoti}>{showNumberNotification()}</div>}
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setTab(3);
              }}
            >
              <ListItemIcon>
                <DeleteSharpIcon />
              </ListItemIcon>
              <ListItemText primary="Bài viết đã xóa" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                logout();
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {tab === 1 && <ListUser />}
        {tab === 2 && <ListReport notification={notifications} />}
        {tab === 3 && <ListPostDeleted />}
      </main>
    </div>
  );
}

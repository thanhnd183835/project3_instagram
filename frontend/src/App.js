import './App.css';
import LoginPage from './Pages/LoginPage/LoginPage';
import HomePage from './Pages/HomePage/HomePage';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import RegisterPage from './Pages/LoginPage/RegisterPage';
import SuggestDetail from './Pages/SuggestDetail/SuggestDetail';
import Profile from './Pages/Profile/Profile';
import ProfileFriend from './Pages/Profile/ProfileFriend';
import Inbox from './Pages/Inbox/Inbox';
import ModalMessage from './Components/ModalMessage/ModalMessage';
import { hideModalMessage } from './redux/message/message.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socket/socket.slice';
import PostDetail from './Pages/PostDetail/PostDetail';
import EditProfile from './Pages/EditProfile/EditProfile';
import io from 'socket.io-client';
import { HOST_URL } from './ultils/constants';
import Dashboard from './Pages/Admin/Dashboard';
import NotFound from './Pages/NotFound';
import { getMe } from './redux/auth/auth.slice';
import ProtectedRoute from './Components/ProtectedRoute';
const socket = io.connect(HOST_URL);

function App(props) {
  const dispatch = useDispatch();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);

  useEffect(() => {
    dispatch(setSocket(socket));
  }, []);

  useEffect(() => {
    dispatch(hideModalMessage());
  }, []);

  useEffect(() => {
    dispatch(getMe());
  }, [props.location]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <ProtectedRoute exact path="/" component={infoUser?.role === 1 ? Dashboard : HomePage} />
        <Route exact path="/register" component={RegisterPage} />
        <ProtectedRoute exact path="/suggest-detail" component={SuggestDetail} />
        <ProtectedRoute exact path="/profile" component={infoUser?.role === 1 ? Dashboard : Profile} />
        <ProtectedRoute exact path="/post/:id" component={PostDetail} />
        <ProtectedRoute exact path="/admin" component={Dashboard} />
        <ProtectedRoute exact path="/profile-friend/:id" component={ProfileFriend} />
        <ProtectedRoute exact path="/inbox/:id" component={Inbox} />
        {/* <ProtectedRoute exact path="/inbox" component={Inbox} /> */}
        <ProtectedRoute exact path="/edit-profile" component={EditProfile} />
        <Route path="*" component={NotFound} />
      </Switch>
      <ModalMessage />
    </BrowserRouter>
  );
}

export default App;

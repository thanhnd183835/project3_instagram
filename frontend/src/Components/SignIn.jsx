import React, { useEffect, useState } from 'react';
import '../Pages/LoginPage/LoginPage.css';
import { signIn } from '../redux/auth/auth.slice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { showModalMessage } from '../redux/message/message.slice';

const SignIn = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleLogin = async () => {
    localStorage.clear();
    const body = {
      email: email,
      password: password,
    };
    const res = await dispatch(signIn(body));
    if (res?.payload?.data?.code === 0) {
      await localStorage.setItem('token', res.payload.data.token);
      await history.push('/');
    } else if (res.payload?.response?.status === 403) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Tài khoản của bạn đã bị khóa',
        }),
      );
    } else if (res.payload.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Email hoặc mật khẩu của bạn không đúng.\nVui lòng kiểm tra lại',
        }),
      );
    }
  };

  useEffect(() => {
    setIsActive(password.length >= 6 && email !== '');
  }, [email, password]);

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="logipage__text"
        placeholder="Phone number, username, or email"
        type="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="logipage__text"
        type="password"
        placeholder="Password"
      />
      <button disabled={!isActive} onClick={handleLogin} className="login__button">
        Log In
      </button>
    </div>
  );
};
export default SignIn;

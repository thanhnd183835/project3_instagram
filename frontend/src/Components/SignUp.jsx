import React, { useState, useEffect } from 'react';
import '../Pages/LoginPage/LoginPage.css';
import { useDispatch } from 'react-redux';
import { signUp } from '../redux/auth/auth.slice';
import { useHistory } from 'react-router-dom';
import { validateEmail } from '../ultils/fucntions';
import { showModalMessage } from '../redux/message/message.slice';

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState({ error: false, msg: '' });
  const [fullNameError, setFullNameError] = useState({ error: false, msg: '' });
  const [userNameError, setUserNameError] = useState({ error: false, msg: '' });
  const [passwordError, setPasswordError] = useState({ error: false, msg: '' });
  const [isActive, setIsActive] = useState(false);

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setEmailError({ error: true, msg: 'Invalid email' });
      return;
    }
    const body = {
      fullName: fullName,
      userName: userName,
      email: email,
      password: password,
    };
    const res = await dispatch(signUp(body));
    if (res?.payload?.data?.code === 0) {
      history.push('/login');
    } else if (res.error.message === 'Request failed with status code 400') {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Email hoặc username đã tồn tại!',
        }),
      );
    }
  };

  useEffect(() => {
    if (
      !emailError.error &&
      email !== '' &&
      fullName !== '' &&
      userName !== '' &&
      !passwordError.error &&
      password.length >= 6
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName, userName, password]);

  return (
    <div>
      <input
        value={email}
        onChange={(e) => {
          e.preventDefault();
          setEmailError({ error: false, msg: '' });
          let value = e.target.value;
          setEmail(value);
        }}
        className="logipage__text"
        type="text"
        placeholder="Mobile number or Email"
      />
      {emailError.error && (
        <p style={{ color: 'red', fontSize: '14px', textAlign: 'left', margin: '0 0 5px 40px' }}>{emailError.msg}</p>
      )}
      <input
        value={fullName}
        onChange={(e) => {
          e.preventDefault();
          setFullNameError({ error: false, msg: '' });
          let value = e.target.value;
          setFullName(value);
        }}
        className="logipage__text"
        type="text"
        placeholder="Full Name"
      />
      {fullNameError.error && <p style={{ color: 'red' }}>{fullNameError.msg}</p>}
      <input
        value={userName}
        onChange={(e) => {
          e.preventDefault();
          setUserNameError({ error: false, msg: '' });
          let value = e.target.value;
          value = value.replace(/[A-Z\s]/g, '');
          setUserName(value);
        }}
        className="logipage__text"
        type="text"
        placeholder="Username"
      />
      {userNameError.error && <p style={{ color: 'red' }}>{userNameError.msg}</p>}
      <input
        value={password}
        onChange={(e) => {
          e.preventDefault();
          setPasswordError({ error: false, msg: '' });
          let value = e.target.value;
          value = value.replace(/\s/g, '');
          if (value.length > 20) {
            setPasswordError({ error: true, msg: 'Password must not exceed 20 characters' });
          }
          setPassword(value);
        }}
        className="logipage__text"
        type="password"
        placeholder="Password"
      />
      {passwordError.error && (
        <p style={{ color: 'red', fontSize: '14px', textAlign: 'left', margin: '0 0 5px 40px' }}>{passwordError.msg}</p>
      )}
      <button className="login__button" onClick={handleSignUp} disabled={!isActive}>
        Sign up
      </button>
    </div>
  );
};
export default SignUp;

import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../../Components/NavBar/Navbar';
import Grid from '@material-ui/core/Grid';
import { format, register } from 'timeago.js';
import './Inbox.css';
import { useSelector, useDispatch } from 'react-redux';
import { getListMessage, addMessage, getRooms } from '../../redux/chat/chat.slice';
import { getProfileFriend } from '../../redux/user/user.slice';
import { updateCountMess } from '../../redux/chat/chat.slice';
import { getTimePost } from '../../ultils/fucntions';
import sendMessage from '../../images/sendMessage.jpg';
import { useHistory } from 'react-router-dom';
import ListUser from '../../Components/ListUser/ListUser';
import { showModalMessage } from '../../redux/message/message.slice';
import { localeFunc } from '../../ultils/constants';
// import RoomIcon from '@material-ui/icons/Room';
const Inbox = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const listMessage = useSelector((state) => state.chat?.listMessage?.data?.data?.room);
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const infoFriend = useSelector((state) => state.user.profileFriend.data.data);
  const socket = useSelector((state) => state.socket.socket.payload);
  const rooms = useSelector((state) => state.chat?.rooms?.data?.data);
  const listFollower = useSelector((state) => state?.user?.followers?.data?.data);
  const listFollowing = useSelector((state) => state?.user?.following?.data?.data);
  const date = Date.now();
  const isDefalut = props.match.params.id === 'default';
  const [idFriend, setIdFriend] = useState('');
  const [active, setActive] = useState(0);
  const [isShowPopupListUser, setIsShowPopupListUser] = useState(false);
  register('my-locale', localeFunc);
  console.log(rooms);

  const [inputText, setInputText] = useState('');
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    const scroll = messagesEnd.current.scrollHeight - messagesEnd.current.clientHeight;
    messagesEnd.current.scrollTo(0, scroll);
  };

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };

  const keyPress = async (e) => {
    if (inputText === '' || inputText.trim() === '') {
      return;
    }
    if (e.keyCode === 13) {
      const response = await dispatch(
        addMessage({
          receiver: infoFriend._id,
          content: inputText.trim(),
        }),
      );

      if (response?.payload?.status === 200) {
        const data = {
          idFriend: infoFriend._id,
          idMe: infoUser._id,
        };
        socket?.emit('inbox_user', data);
      } else {
        console.log('ERRR');
        dispatch(
          showModalMessage({
            type: 'ERROR',
            msg: 'Đã có lỗi xảy ra, có thể tài khoản của bạn hoặc người gửi đã bị khóa!',
          }),
        );
      }
      dispatch(getListMessage(infoFriend._id));
      scrollToBottom();
      setInputText('');
    }
  };

  useEffect(() => {
    socket?.on('get_message', async (data) => {
      if (infoUser._id === data.idFriend) {
        await dispatch(getListMessage(props.match.params.id));
        scrollToBottom();
      }
    });
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [listMessage]);

  useEffect(() => {
    dispatch(getListMessage(props.match.params.id));
    dispatch(getProfileFriend(props.match.params.id));
    dispatch(getRooms());
    scrollToBottom();
  }, [props.match.params.id]);

  const listFriend = () => {
    if (listFollower.length === 0) return listFollowing;
    if (listFollowing.length === 0) return listFollower;
    const listId = listFollowing.map((item) => item._id);
    return listFollowing.concat(listFollower.filter((ele) => !listId.includes(ele._id)));
  };
  return (
    <>
      <NavBar />

      {/* <Grid container> */}
      {/* <Grid item xs={2}></Grid> */}
      {/* <div style={{display: 'flex', width: '100%', maxWidth: '950px'}}> */}
      <div className="inbox_box">
        <div className="inbox_listChat">
          <div className="listChat_header">{infoUser.userName}</div>
          <div className="listChat_content">
            {rooms &&
              rooms?.length > 0 &&
              rooms.map((room, index) => (
                <div
                  onClick={() => {
                    if (room?.users[0].user._id === infoUser._id) {
                      dispatch(getListMessage(room?.users[1].user._id));
                      dispatch(getProfileFriend(room?.users[1].user._id));
                      dispatch(updateCountMess({ userId: room?.users[1].user._id, action: 'DELETE' }));
                      history.push(`/inbox/${room?.users[1].user._id}`);
                    } else {
                      dispatch(getListMessage(room?.users[0].user._id));
                      dispatch(getProfileFriend(room?.users[0].user._id));
                      dispatch(updateCountMess({ userId: room?.users[0].user._id, action: 'DELETE' }));
                      history.push(`/inbox/${room?.users[0].user._id}`);
                    }

                    setActive(index);
                  }}
                  className={index === active ? 'room_active' : 'room_element'}
                >
                  <img
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    className="room-avatar"
                    src={`http://localhost:5000/public/${
                      room?.users[0].user?._id === infoUser?._id
                        ? room?.users[1].user?.avatar
                        : room?.users[0].user?.avatar
                    }`}
                    alt="element"
                  ></img>
                  <div className="room_userName">
                    <div className="room_userName">
                      {room?.users[0].user?._id === infoUser?._id
                        ? room?.users[1].user?.userName
                        : room?.users[0].user?.userName}
                    </div>
                    <div className="room_active_text">
                      {room?.users[1].user?._id !== infoUser._id ? (
                        room?.users[1].user?.active ? (
                          <ul className="active_user">
                            <li>Đang hoạt động</li>
                          </ul>
                        ) : (
                          <div style={{ color: 'silver' }}>
                            Hoạt động {format(room?.users[1].user?.updatedAt, 'my-locale')}
                          </div>
                        )
                      ) : room?.users[0].user?.active ? (
                        <ul className="active_user">
                          <li>Đang hoạt động</li>
                        </ul>
                      ) : (
                        <div style={{ color: 'silver' }}>
                          Hoạt động {format(room?.users[0].user?.updatedAt, 'my-locale')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="box_data">
          {!isDefalut && (
            <div className="header">
              <img
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                className="profile-avatar"
                src={`http://localhost:5000/public/${infoFriend?.avatar}`}
                alt="element"
              ></img>
              <div
                className="profile-user-name"
                onClick={() => {
                  history.push(`/profile-friend/${infoFriend?._id}`);
                }}
              >
                &nbsp;{infoFriend?.userName}
              </div>
            </div>
          )}

          <div className="chat">
            <div ref={messagesEnd} className="chat_content">
              {isDefalut && (
                <div className="chat_default">
                  <img src={sendMessage} height={96} width={96} />
                  <div style={{ fontSize: '26px' }}>Tin nhắn của bạn</div>
                  <button className="inbox_btn_send" onClick={() => setIsShowPopupListUser(true)}>
                    Gửi tin nhắn
                  </button>

                  {isShowPopupListUser && (
                    <ListUser
                      data={listFriend()}
                      isSearch={true}
                      title={'Gửi tin nhắn'}
                      handleClose={() => setIsShowPopupListUser(false)}
                    />
                  )}
                </div>
              )}
              {!isDefalut &&
                listMessage &&
                listMessage.length > 0 &&
                listMessage.map((item, index) =>
                  infoUser._id === item.sender ? (
                    <div className="inbox_element">
                      <div className="inbox_content_sender">{item.content}</div>
                    </div>
                  ) : (
                    <div className="inbox_element">
                      <div className="inbox_content_receiver">{item.content}</div>
                    </div>
                  ),
                )}
            </div>
            {!isDefalut && (
              <input
                onChange={handleChangeInput}
                value={inputText}
                className="chat_input"
                placeholder="Nhắn tin..."
                type="text"
                onKeyDown={keyPress}
              ></input>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* <Grid item xs={2}></Grid> */}
      {/* </Grid> */}
    </>
  );
};

export default Inbox;

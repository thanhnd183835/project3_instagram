import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Suggestion.css';
import { Avatar } from '@material-ui/core';
import { followApi, unFollowApi } from '../../redux/user/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { followNotification } from '../../redux/notification/notification.slice';
import { HOST_URL, PREVLINK } from '../../ultils/constants';

const Suggestion = () => {
  const history = useHistory();
  const [listSuggest, setListSuggest] = useState([]);
  const socket = useSelector((state) => state.socket.socket.payload);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      axios({
        method: 'get',
        url: `${HOST_URL}/api/user/get-user-suggest`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }).then((response) => {
        // console.log(response);
        if (response.status === 200) {
          setListSuggest(response.data.data);
        }
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SuggestItem = (props) => {
    const [followed, setFollowed] = useState(false);
    const handleFollow = async () => {
      await dispatch(followApi(props.id));
      setFollowed(true);
      await dispatch(followNotification(props.id));
      const data = {
        idUser: props.id,
        userNameCreatePost: props.username,
      };
      socket?.emit('follow_user', data);
    };
    const handleUnFollow = async () => {
      await dispatch(unFollowApi(props.id));
      setFollowed(false);
    };

    return (
      <div className="suggestions__friends">
        <Avatar src={props.avatar} className="suggestions__image" />
        <a className="suggestions__username" href={`/profile-friend/${props.id}`}>
          {props.username}
        </a>
        {followed ? (
          <div onClick={handleUnFollow} className="suggestions__follow" style={{ color: '#262626' }}>
            Đang theo dõi
          </div>
        ) : (
          <div onClick={handleFollow} className="suggestions__follow">
            Theo dõi
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <div className="suggestions__container">
        <div className="suggestions__header">
          <div>Gợi ý cho bạn</div>
          <div
            onClick={() => {
              history.push('/suggest-detail');
            }}
            className="suggestions__header__showall"
          >
            Xem tất cả
          </div>
        </div>
        <div className="suggestions__body">
          {listSuggest &&
            listSuggest.length > 0 &&
            listSuggest.map((item, index) => (
              <SuggestItem key={index} id={item._id} avatar={`${PREVLINK}${item.avatar}`} username={item.userName} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;

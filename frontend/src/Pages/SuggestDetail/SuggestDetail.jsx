import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import './SuggestDetail.css';
import { Avatar } from '@material-ui/core';
import NavBar from '../../Components/NavBar/Navbar';
import { followApi, removeRequestApi, unFollowApi } from '../../redux/user/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { followNotification } from '../../redux/notification/notification.slice';
import { HOST_URL, PREVLINK } from '../../ultils/constants';
import { useHistory } from 'react-router';

const SuggestDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [listSuggest, setListSuggest] = useState([]);
  const socket = useSelector((state) => state.socket.socket.payload);

  const SuggestItem = (props) => {
    const [followed, setFollowed] = useState(false);
    console.log(props.id, followed);

    const handleFollow = async () => {
      await dispatch(followApi(props.id));
      await dispatch(followNotification(props.id));
      setFollowed(true);
      const data = {
        idUser: props.id,
        userNameCreatePost: props.userName,
      };
      socket?.emit('follow_user', data);
    };
    const handleUnFollow = async () => {
      await dispatch(unFollowApi(props.id));
      setFollowed(false);
    };

    const handlRemoveRequest = async () => {
      await dispatch(removeRequestApi(props.id));
      setFollowed(false);
    };

    return (
      <div key={props.key} className="element">
        <div className="data">
          <Avatar
            src={PREVLINK + props.avatar}
            className="suggestions__image__detail"
            onClick={() => {
              history.push(`/profile-friend/${props.id}`);
            }}
          />
          <div className="info">
            <div
              className="user-name"
              onClick={() => {
                history.push(`/profile-friend/${props.id}`);
              }}
            >
              {props.userName}
            </div>
            <div className="full-name">{props.fullName}</div>
            <div className="followers">có {props.followers.length} người theo dõi</div>
          </div>
        </div>

        {followed ? (
          props.status === 1 ? (
            <button className="followed" onClick={handlRemoveRequest}>
              Đã yêu cầu
            </button>
          ) : (
            <button className="followed" onClick={handleUnFollow}>
              Hủy theo dõi
            </button>
          )
        ) : (
          <button className="follow" onClick={handleFollow}>
            Theo dõi
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      axios({
        method: 'get',
        url: `${HOST_URL}/api/user/get-all-suggest`,
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
  console.log(listSuggest);
  return (
    <>
      <NavBar />
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <div className="suggest">Gợi ý</div>
          <div className="list-data">
            {listSuggest &&
              listSuggest.length > 0 &&
              listSuggest.map((item, index) => (
                <SuggestItem
                  key={index}
                  id={item._id}
                  userName={item.userName}
                  fullName={item.fullName}
                  avatar={item.avatar}
                  followers={item.followers}
                  status={item.status}
                />
              ))}
          </div>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </>
  );
};

export default SuggestDetail;

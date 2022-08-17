/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import './Profile.css';
import { makeStyles } from '@material-ui/core/styles';
import Popup from '../../Components/Popup/Popup';
import { getFollowers, getFollowing } from '../../redux/user/user.slice';
// import { followApi, unFollowApi } from '../../redux/user/user.slice';
import { getPostMe } from '../../redux/post/post.slice';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Avatar from 'react-avatar-edit';
import { showModalMessage } from '../../redux/message/message.slice';
import { getMe } from '../../redux/auth/auth.slice';
import { useHistory } from 'react-router';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ListUser from '../../Components/ListUser/ListUser';

const useStyles = makeStyles(() => ({
  profileContainer: {
    width: '100%',
    maxWidth: '950px',
    margin: 'auto',
  },
  popup_follower: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 20px 0 20px',
    '& .pop_btn': {
      marginLeft: '100px',
      height: '30px',
      fontWeight: 600,
      marginTop: '6px',
    },
    '& .pop_name': {
      marginLeft: '10px',
      '& .pop_fullName': {
        fontWeight: 600,
      },
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isShowFollowers, setIsShowFollowers] = useState(false);
  const [isShowFollowing, setIsShowFollowing] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const listFollower = useSelector((state) => state?.user?.followers?.data?.data);
  const listFollowing = useSelector((state) => state?.user?.following?.data?.data);
  const listPostForMe = useSelector((state) => state.post?.postOfMe?.data);

  const ShowPicture = (props) => {
    return (
      <>
        <div
          className="profile_picture_container"
          onClick={() => {
            history.push({
              pathname: `/post/${props.id}`,
              state: {
                postId: props.id,
                liked: props.liked,
                numberLikes: props.likes,
                followed: listFollowing?.find((i) => i._id === props?.userId) ? true : false,
              },
            });
          }}
        >
          <img
            className="profile_picture"
            style={{ width: '300px', height: '300px' }}
            src={'http://localhost:5000/public/' + props.picture}
          ></img>
          <div className="profile_icon_in_picture">
            <span style={{ display: 'flex', alignItems: 'center', columnGap: '6px' }}>
              <FavoriteIcon style={{ color: 'white' }} />
              <span style={{ color: 'white', fontWeight: 'bold' }}>{props.likes}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', columnGap: '6px' }}>
              <ChatBubbleIcon style={{ color: 'white' }} />
              <span style={{ color: 'white', fontWeight: 'bold' }}>{props.comments}</span>
            </span>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    dispatch(getFollowers());
    dispatch(getFollowing());
    dispatch(getPostMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeAvatar = (e) => {
    const formData = new FormData();
    formData.append('pictures', editorRef.state?.file);
    axios({
      method: 'post',
      url: `http://localhost:5000/api/user/change-avatar`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      data: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          setIsChangeAvatar(false);
          dispatch(getMe());
          dispatch(
            showModalMessage({
              type: 'SUCCESS',
              msg: 'Thay đổi anh đại diện thành công!',
            }),
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (preview) => {
    setPreview(preview);
  };

  return (
    <>
      <NavBar />
      <div className={classes.profileContainer}>
        <div className="profile-header">
          <div className="profile-avatar-box">
            <img
              style={{ width: '200px', height: '200px', borderRadius: '50%' }}
              className="profile-avatar"
              src={`http://localhost:5000/public/${infoUser.avatar}`}
              alt="element"
            ></img>
            <div
              className="icon_picture"
              onClick={() => {
                setIsChangeAvatar(true);
                setPreview(null);
              }}
            >
              <CameraAltIcon />
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-title">
              <div className="profile-user-name">{infoUser.userName}</div>
              <button
                className="profile__button__edit"
                onClick={() => {
                  history.push({
                    pathname: `/edit-profile`,
                  });
                }}
              >
                Chỉnh sửa trang cá nhân
              </button>
            </div>
            <div className="profile-info-detail">
              <div style={{ cursor: 'pointer' }} className="profile-post">
                <b>{listPostForMe?.length}</b> bài viết
              </div>
              <div
                onClick={() => {
                  setIsShowFollowers(true);
                }}
                style={{ cursor: 'pointer' }}
                className="profile-followers"
              >
                <b>{listFollower?.length}</b> người theo dõi
              </div>
              <div
                onClick={() => {
                  setIsShowFollowing(true);
                }}
                style={{ cursor: 'pointer' }}
                className="profile-following"
              >
                Đang theo dõi <b>{listFollowing?.length}</b> người dùng
              </div>
            </div>
            <div className="profile-full-name">{infoUser.fullName}</div>
          </div>
        </div>
        {listPostForMe && listPostForMe?.length > 0 ? (
          <div className="profile-body">
            {listPostForMe.map((item) => (
              <ShowPicture
                likes={item.likes.length}
                comments={item.comments.length}
                picture={item.pictures[0].img}
                id={item?._id}
                liked={item.likes.find((i) => i.userId === infoUser._id) ? true : false}
                userId={item?.postBy}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '50vh',
              fontSize: '28px',
            }}
          >
            <p>Chưa có bài viết</p>
          </div>
        )}
      </div>

      {isShowFollowers && (
        <ListUser data={listFollower} title={'Người theo dõi'} handleClose={() => setIsShowFollowers(false)} />
      )}

      <Popup
        isOpen={isChangeAvatar}
        handleClose={() => {
          setIsChangeAvatar(false);
        }}
        title="Change Avatar"
        isIconClose={true}
        minwidth="500px"
      >
        <div className="editor">
          <Avatar
            width={390}
            height={295}
            onCrop={onCrop}
            onClose={onClose}
            src={src}
            // labelStyle={this.state.labelStyle}
            ref={(ref) => setEditorRef(ref)}
          />
          <img src={preview} alt="Preview" />
        </div>
        <button onClick={handleChangeAvatar} className="profile_btn_save">
          Save change
        </button>
      </Popup>
      {isShowFollowing && (
        <ListUser data={listFollowing} title={'Đang theo dõi'} handleClose={() => setIsShowFollowing(false)} />
      )}
    </>
  );
};

export default Profile;

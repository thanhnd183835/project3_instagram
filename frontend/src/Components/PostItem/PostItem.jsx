import React, { useEffect, useState } from 'react';
import './PostItem.css';
import { Avatar } from '@material-ui/core';
import love from '../../images/love.svg';
import redlove from '../../images/redlove.svg';
import comment from '../../images/comment.svg';
import edit from '../../images/threedot.svg';
import { useDispatch, useSelector } from 'react-redux';
import { commentApi, reactApi } from '../../redux/post/post.slice';
// import { border } from '@mui/system';
import Popup from '../../Components/Popup/Popup';
import {
  likeNotification,
  commentNotification,
  reportPostNotification,
} from '../../redux/notification/notification.slice';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { listReportPost, PREVLINK } from '../../ultils/constants';
import { showModalMessage } from '../../redux/message/message.slice';
import { unFollowApi } from '../../redux/user/user.slice';
import ListUser from '../../Components/ListUser/ListUser';
import { getListUserLiked } from '../../redux/post/post.slice';
const PostItem = (props) => {
  const [liked, setLiked] = useState(props.liked);
  const [numberLikes, setNumberLikes] = useState(props.likes);
  const commentList = [...props.comments];
  const [commentExtra, setCommentExtra] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showListReport, setShowListReport] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const socket = useSelector((state) => state.socket.socket.payload);
  const [showListUser, setShowListUser] = useState(false);
  const [listUserLiked, setListUserLiked] = useState([]);

  const handleReact = async () => {
    const res = await dispatch(reactApi(props.id));
    if (res.payload.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Bài viết không khả dụng!',
        }),
      );
      return;
    }
    setNumberLikes(liked ? numberLikes - 1 : numberLikes + 1);
    setLiked(!liked);
    if (!liked && props?.userId !== infoUser?._id) {
      await dispatch(likeNotification(props.id));
      const data = {
        idPost: props.id,
        userNameCreatePost: props.userName,
      };
      socket?.emit('like_post', data);
    }
  };

  const handleUnFollow = async (id) => {
    await dispatch(unFollowApi(id));
    setShowModal(false);
  };

  const handleAddComment = async () => {
    setCommentValue('');
    const data = {
      postId: props.id,
      userId: infoUser._id,
      content: commentValue,
    };
    const res = await dispatch(commentApi(data));
    if (res.payload.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Bài viết không khả dụng!',
        }),
      );
      return;
    }
    if (res?.payload?.data?.code === 0) {
      const newList = [...commentExtra, { ...data, userName: infoUser.userName }];
      setCommentExtra(newList);
      if (props?.userId !== infoUser?._id) {
        await dispatch(commentNotification(props.id));
        const dataPost = {
          idPost: props.id,
          userNameCreatePost: props.userName,
        };
        socket?.emit('comment_post', dataPost);
      }
    }
  };

  useEffect(() => {
    setActive(commentValue !== '');
  }, [commentValue]);

  const CommentExtraList = (list) => {
    if (list.length > 0) {
      return list.map((item, index) => (
        <div style={{ display: 'flex' }}>
          <p
            className="post_comment"
            style={{ fontWeight: '600', cursor: 'pointer' }}
            onClick={() => {
              goToProfile(item.userId);
            }}
          >
            {item.userName} &nbsp;
          </p>
          <p className="post_comment" style={{ marginLeft: '-10px' }}>
            {item.content}
          </p>
        </div>
      ));
    }
    return <span></span>;
  };

  const handleReport = async (content) => {
    const data = {
      postId: props.id,
      content: content,
    };
    const res = await dispatch(reportPostNotification(data));
    // console.log(res);
    if (res.error?.message === 'Request failed with status code 404') {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Bài viết không khả dụng!',
        }),
      );
      return;
    }
    if (res?.payload?.data?.code === 0) {
      dispatch(
        showModalMessage({
          type: 'SUCCESS',
          msg: 'Báo cáo thành công!, Cảm ơn bạn đã phản hồi với chúng tôi',
        }),
      );
      setShowListReport(false);
      const dataPost = {
        idPost: props.id,
        userNameCreatePost: props.userName,
        admin: 'admin',
      };
      socket?.emit('report_post', dataPost);
    }
  };

  const goToProfile = (id) => {
    if (infoUser._id === id) {
      history.push('/profile');
    } else {
      history.push({
        pathname: `/profile-friend/${id}`,
      });
    }
  };

  return (
    <>
      <div className="post__container">
        {/* Header */}
        <div className="post__header">
          <Avatar
            onClick={() => {
              history.push({
                pathname: `/profile-friend/${props.userId}`,
              });
            }}
            style={{ cursor: 'pointer' }}
            className="post__image"
            src={`${PREVLINK}/${props.avatar}`}
          />
          <div
            onClick={() => {
              history.push({
                pathname: `/profile-friend/${props.userId}`,
              });
            }}
            style={{ cursor: 'pointer' }}
            className="post__username"
          >
            {props.userName}
          </div>
          <div
            style={{
              display: 'flex',
              margin: 'auto',
              justifyContent: 'flex-end',
              width: '70%',
            }}
          >
            <img
              src={edit}
              alt="element"
              width="20px"
              onClick={() => {
                setShowModal(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <img src={props.postImage} alt="element" width="100%" s style={{ maxHeight: '770px' }} />
        </div>
        {/* Analytics */}
        <div>
          <div style={{ marginLeft: '10px' }}>
            {liked ? (
              <img src={redlove} className="post_reactimage" alt="element" onClick={handleReact} />
            ) : (
              <img src={love} className="post_reactimage" alt="element" onClick={handleReact} />
            )}
            <Link
              to={{
                pathname: `/post/${props.id}`,
                state: {
                  postId: props.id,
                  liked: liked,
                  numberLikes: numberLikes,
                  followed: true,
                },
              }}
            >
              <img src={comment} alt="element" className="post_reactimage" />
            </Link>
          </div>
          <div
            onClick={async () => {
              const result = await dispatch(getListUserLiked(props.id));
              if (result.payload?.status === 200) {
                setListUserLiked(result.payload?.data?.data?.likes);
              }
              setShowListUser(true);
            }}
            style={{ fontWeight: 'bold', marginLeft: '20px  ' }}
          >
            {numberLikes} người thích
          </div>
        </div>
        <div style={{ display: 'flex', margin: '10px 10px 0' }}>
          <p
            style={{ fontWeight: '600', margin: '0px 0px', cursor: 'pointer' }}
            onClick={() => {
              goToProfile(props?.userId);
            }}
          >
            {props.userName} &nbsp;
          </p>
          <p style={{ margin: '0px 0px' }}>{props.title}</p>
        </div>
        {/* Comment Section */}
        <div>
          {commentList.map((item, index) =>
            index < 2 ? (
              <div style={{ display: 'flex' }}>
                <span
                  className="post_comment"
                  style={{ fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    goToProfile(item.userId?._id);
                  }}
                >
                  {item.userId?.userName} &nbsp;
                </span>
                <span className="post_comment" style={{ marginLeft: '-10px' }}>
                  {item.content}
                </span>
              </div>
            ) : (
              <span></span>
            ),
          )}
          {CommentExtraList(commentExtra)}
          {commentList.length + commentExtra.length >= 3 && (
            <div style={{ fontSize: '14px', margin: '10px' }}>
              <Link
                to={{
                  pathname: `/post/${props.id}`,
                  state: {
                    postId: props.id,
                    liked: liked,
                    numberLikes: numberLikes,
                    followed: true,
                  },
                }}
                style={{ textDecoration: 'none', color: '#8e8e8e' }}
              >
                Xem tất cả {commentList.length + commentExtra.length} bình luận
              </Link>
            </div>
          )}
          <div style={{ display: 'flex' }}>
            <input
              text="text"
              className="post__commentbox"
              placeholder="Add a comment..."
              onChange={(e) => {
                setCommentValue(e.target.value);
              }}
              value={commentValue}
            />
            <button className="button_add_comment" onClick={handleAddComment} disabled={!active}>
              Đăng
            </button>
          </div>
        </div>
        {showModal && (
          <Popup
            isOpen={showModal}
            handleClose={() => {
              setShowModal(false);
            }}
            isIconClose={false}
            isScroll={true}
          >
            {infoUser?.role === 1 && (
              <>
                <div className="popup_report_text" style={{ color: 'red', fontWeight: 'bold' }}>
                  Xóa
                </div>
                <hr className="popup_report_hr" />
              </>
            )}
            <div
              className="popup_report_text"
              style={{ color: 'black', fontWeight: 'bold' }}
              onClick={() => {
                history.push({
                  pathname: `/post/${props.id}`,
                  state: {
                    postId: props.id,
                    liked: liked,
                    numberLikes: numberLikes,
                    followed: true,
                  },
                });
              }}
            >
              Đi tới bài viết
            </div>
            <hr className="popup_report_hr" />
            <div
              className="popup_report_text"
              style={{ color: 'red', fontWeight: 'bold' }}
              onClick={() => {
                setShowModal(false);
                setShowListReport(true);
              }}
            >
              Báo cáo
            </div>
            <hr className="popup_report_hr" />
            <div
              className="popup_report_text"
              style={{ color: 'red', fontWeight: 'bold' }}
              onClick={() => {
                handleUnFollow(props?.userId);
              }}
            >
              Bỏ theo dõi
            </div>
            <hr className="popup_report_hr" />
            <div
              className="popup_report_text"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Hủy
            </div>
          </Popup>
        )}
        {showListReport && (
          <Popup
            isOpen={showListReport}
            handleClose={() => {
              setShowListReport(false);
            }}
            isIconClose={true}
            isScroll={true}
            title="Báo cáo"
          >
            <div className="popup_report_text" style={{ color: 'black', fontWeight: 'bold' }}>
              Tại sao bạn muốn báo cáo nội dung này ?
            </div>
            <hr className="popup_report_hr" />
            {listReportPost.map((content) => (
              <>
                <div
                  className="popup_report_text"
                  onClick={() => {
                    handleReport(content);
                  }}
                >
                  {content}
                </div>
                <hr className="popup_report_hr" />
              </>
            ))}
            <div
              className="popup_report_text"
              onClick={() => {
                setShowListReport(false);
              }}
            >
              Hủy
            </div>
          </Popup>
        )}
        {showListUser && (
          <ListUser data={listUserLiked} title={'Lượt thích'} handleClose={() => setShowListUser(false)} />
        )}
      </div>
    </>
  );
};

export default PostItem;

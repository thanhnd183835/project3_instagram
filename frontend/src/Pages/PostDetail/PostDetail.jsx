import { Avatar, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../../Components/NavBar/Navbar';
import love from '../../images/love.svg';
import redlove from '../../images/redlove.svg';
import edit from '../../images/threedot.svg';
import comment from '../../images/comment.svg';
import { commentApi, reactApi, removeCommentApi, removePostApi } from '../../redux/post/post.slice';
import {
  likeNotification,
  commentNotification,
  reportPostNotification,
} from '../../redux/notification/notification.slice';
import { followNotification } from '../../redux/notification/notification.slice';
import './postDetail.css';
import { HOST_URL, listReportPost, localeFunc, PREVLINK } from '../../ultils/constants';
import axios from 'axios';
import Popup from '../../Components/Popup/Popup';
import { getTimePost } from '../../ultils/fucntions';
import { format, register } from 'timeago.js';
import { followApi, unFollowApi } from '../../redux/user/user.slice';
import { showModalMessage } from '../../redux/message/message.slice';
import { useHistory } from 'react-router';
import NotFound from '../NotFound';
import ListUser from '../../Components/ListUser/ListUser';
import { getListUserLiked } from '../../redux/post/post.slice';
import CircularProgress from '@material-ui/core/CircularProgress';
const PostDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [liked, setLiked] = useState(props.location.state.liked);
  const [numberLikes, setNumberLikes] = useState(props.location.state.numberLikes);
  const [commentChange, setCommentChange] = useState(0);
  const socket = useSelector((state) => state.socket.socket.payload);
  const [commentValue, setCommentValue] = useState('');
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const [active, setActive] = useState(false);
  const [post, setPost] = useState({});
  const [showModal, setShowModal] = useState(0); // console.log(props.location.state.postId);
  const [followed, setFollowed] = useState(props.location.state.followed);
  const [commentId, setCommentId] = useState('');
  const [commentUserId, setCommentUserId] = useState('');
  const [showListReport, setShowListReport] = useState(false);
  const [showListUser, setShowListUser] = useState(false);
  const [listUserLiked, setListUserLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  register('my-locale', localeFunc);

  useEffect(() => {
    // window.location.reload();
    axios({
      method: 'get',
      url: `${HOST_URL}/api/post/get-post/${props.location.state.postId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then((response) => {
      // console.log(response);
      if (response.status === 200) {
        setPost(response.data.data);
        setLoading(false);
      }
    });
  }, [commentChange]);

  const handleFollow = async () => {
    await dispatch(followApi(post?.postBy?._id));
    setFollowed(true);
    await dispatch(followNotification(post?.postBy?._id));
    const data = {
      idUser: post?.postBy?._id,
      userNameCreatePost: post?.postBy?.userName,
    };
    socket?.emit('follow_user', data);
  };
  const handleUnFollow = async () => {
    await dispatch(unFollowApi(post?.postBy?._id));
    setFollowed(false);
  };

  const handleReact = async () => {
    const res = await dispatch(reactApi(props.location.state.postId));
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
    if (!liked && post?.postBy?._id !== infoUser?._id) {
      await dispatch(likeNotification(props.location.state.postId));
      const data = {
        idPost: props.location.state.postId,
        userNameCreatePost: post?.postBy?.userName,
      };
      socket?.emit('like_post', data);
    }
  };

  const handleAddComment = async () => {
    setCommentValue('');
    const data = {
      postId: props.location.state.postId,
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
      if (post?.postBy?._id !== infoUser?._id) {
        await dispatch(commentNotification(props.location.state.postId));
        const dataPost = {
          idPost: props.location.state.postId,
          userNameCreatePost: post?.postBy?.userName,
        };
        socket?.emit('comment_post', dataPost);
      }
      setCommentChange(commentChange + 1);
    }
  };

  const handleRemoveComment = async (id, userId) => {
    if (!(post?.postBy?._id === infoUser?._id || infoUser?.role === 1 || userId === infoUser?._id)) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Bạn không có quyền thay đổi bình luận này!',
        }),
      );
      return;
    }
    const data = {
      postId: post._id,
      commentId: commentId,
    };
    const res = await dispatch(removeCommentApi(data));
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
      setCommentChange(commentChange - 1);
      setShowModal(0);
    }
  };

  useEffect(() => {
    setActive(commentValue !== '');
  }, [commentValue]);

  const handleReport = async (content) => {
    const data = {
      postId: props.location.state.postId,
      content: content,
    };
    const res = await dispatch(reportPostNotification(data));
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

  const handleRemovePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      const res = await dispatch(removePostApi(props.location.state.postId));
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
        dispatch(
          showModalMessage({
            type: 'SUCCESS',
            msg: 'Xóa bài viết thành công!',
          }),
        );
        setShowModal(0);
        history.push('/profile');
      }
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
  // console.log(post?.status);
  return (
    <>
      {loading ? (
        <>
          <NavBar />
          <div style={{ height: '100px', width: '100%', margin: 'auto' }}></div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        </>
      ) : post?.status === 0 || infoUser.role === 1 ? (
        <>
          <NavBar />
          <div>
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={6} className="post_detail_container">
                <div style={{ border: '1px solid #dfdfdf', width: '100%' }}>
                  <img
                    className="post_detail_img"
                    // height="598"
                    // style={{ width: '100%', maxWidth: '598px' }}
                    alt="element"
                    src={PREVLINK + post?.pictures?.['0'].img}
                    // src=""
                  />
                </div>
                <div className="post_detail_comment_container">
                  <div className="post_detail_header">
                    <Avatar className="post__image" src={PREVLINK + post?.postBy?.avatar} />
                    <div
                      className="post_detail_username"
                      onClick={() => {
                        goToProfile(post?.postBy?._id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {post?.postBy?.userName}
                    </div>
                    {post?.postBy?._id === infoUser?._id || infoUser?.role === 1 ? (
                      <div
                        className="post_detail_username"
                        style={{ color: '#262626', whiteSpace: 'nowrap', cursor: 'pointer', width: '90px' }}
                      ></div>
                    ) : followed ? (
                      <div
                        onClick={handleUnFollow}
                        className="post_detail_username"
                        style={{ color: '#262626', whiteSpace: 'nowrap', cursor: 'pointer', width: '90px' }}
                      >
                        Hủy theo dõi
                      </div>
                    ) : (
                      <div
                        onClick={handleFollow}
                        className="post_detail_username"
                        style={{ whiteSpace: 'nowrap', cursor: 'pointer', color: '#0095f6', width: '90px' }}
                      >
                        Theo dõi
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        marginRight: '14px',
                        justifyContent: 'flex-end',
                        width: '70%',
                      }}
                    >
                      <img
                        src={edit}
                        alt="element"
                        width="20px"
                        onClick={() => {
                          setShowModal(1);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  <div className="post_detail_list_comment">
                    <div className="post_detail_user_comment">
                      <Avatar className="post__image" src={PREVLINK + post?.postBy?.avatar} />
                      <div
                        className="post_detail_username"
                        style={{ marginLeft: '10px', marginTop: '10px', cursor: 'pointer' }}
                        onClick={() => {
                          goToProfile(post?.postBy?._id);
                        }}
                      >
                        {post?.postBy?.userName}
                      </div>
                      <div className="post_detail_content_commnet">{post?.title}</div>
                    </div>
                    <div className="post_detail_day">{format(post?.createdAt, 'my-locale')}</div>
                    {post.comments?.length > 0 &&
                      post.comments.map((comment, index) => (
                        <div className="post_detail_user_comment" style={{ marginTop: '10px' }} key={index}>
                          <Avatar className="post__image" src={PREVLINK + comment?.userId?.avatar} />
                          <div className="post_detail_content_commnet">
                            <b onClick={() => goToProfile(comment?.userId?._id)} style={{ cursor: 'pointer' }}>
                              {comment?.userId?.userName}
                            </b>{' '}
                            &nbsp; {comment?.content}
                            <img
                              className="post_detail_edit_comment"
                              src={edit}
                              alt="element"
                              width="15px"
                              onClick={() => {
                                setShowModal(2);
                                setCommentId(comment?._id);
                                setCommentUserId(comment?.userId?._id);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* {infoUser?.role !== 1 && (
                <> */}
                  <div className="post_detail_action">
                    <div style={{ marginLeft: '10px' }}>
                      {liked ? (
                        <img src={redlove} className="post_reactimage" alt="element" onClick={handleReact} />
                      ) : (
                        <img
                          src={love}
                          className="post_reactimage"
                          alt="element"
                          onClick={() => {
                            if (infoUser?.role === 1) {
                              return;
                            } else {
                              handleReact();
                            }
                          }}
                          style={{ cursor: infoUser?.role === 1 ? 'auto' : '' }}
                        />
                      )}

                      <img
                        src={comment}
                        alt="element"
                        className="post_reactimage"
                        style={{ cursor: infoUser?.role === 1 ? 'auto' : '' }}
                      />
                    </div>
                    <div
                      onClick={async () => {
                        const result = await dispatch(getListUserLiked(props.match?.params?.id));
                        if (result.payload?.status === 200) {
                          setListUserLiked(result.payload?.data?.data?.likes);
                        }
                        setShowListUser(true);
                      }}
                      style={{ fontWeight: 'bold', marginLeft: '20px  ', cursor: 'pointer' }}
                    >
                      {numberLikes ? numberLikes : 0} người thích
                    </div>
                    <div className="post_detail_day_down">{format(post?.createdAt, 'my-locale')}</div>
                  </div>
                  {/* Comment Section */}
                  <div>
                    <div style={{ display: 'flex' }}>
                      <input
                        text="text"
                        className="detail_post__commentbox"
                        placeholder="Add a comment..."
                        onChange={(e) => {
                          if (infoUser?.role !== 1) {
                            setCommentValue(e.target.value);
                          }
                        }}
                        value={commentValue}
                      />
                      <button
                        className="button_add_comment"
                        onClick={handleAddComment}
                        disabled={!active || infoUser?.role === 1}
                      >
                        Đăng
                      </button>
                    </div>
                  </div>
                  {/* </>
              )} */}
                </div>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </div>
          {showModal === 1 && (
            <Popup
              isOpen={showModal === 1}
              handleClose={() => {
                setShowModal(0);
              }}
              isIconClose={false}
              isScroll={true}
            >
              {post?.postBy?._id === infoUser?._id || infoUser?.role === 1 ? (
                <>
                  <div
                    className="popup_report_text"
                    style={{ color: 'red', fontWeight: 'bold' }}
                    onClick={() => {
                      handleRemovePost();
                    }}
                  >
                    Xóa
                  </div>
                  <hr className="popup_report_hr" />
                </>
              ) : (
                <>
                  <div
                    className="popup_report_text"
                    style={{ color: 'red', fontWeight: 'bold' }}
                    onClick={() => {
                      setShowModal(0);
                      setShowListReport(true);
                    }}
                  >
                    Báo cáo
                  </div>
                  <hr className="popup_report_hr" />
                  <div className="popup_report_text" style={{ color: 'red', fontWeight: 'bold' }}>
                    Bỏ theo dõi
                  </div>
                  <hr className="popup_report_hr" />
                </>
              )}

              <div
                className="popup_report_text"
                onClick={() => {
                  setShowModal(0);
                }}
              >
                Hủy
              </div>
            </Popup>
          )}
          {showModal === 2 && (
            <Popup
              isOpen={showModal === 2}
              handleClose={() => {
                setShowModal(0);
              }}
              isIconClose={false}
              isScroll={true}
            >
              <div
                className="popup_report_text"
                style={{ color: 'red', fontWeight: 'bold' }}
                onClick={() => {
                  handleRemoveComment(commentId, commentUserId);
                }}
              >
                Xóa
              </div>
              <hr className="popup_report_hr" />

              <div
                className="popup_report_text"
                onClick={() => {
                  setShowModal(0);
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
        </>
      ) : (
        <NotFound />
      )}
      {showListUser && (
        <ListUser data={listUserLiked} title={'Lượt thích'} handleClose={() => setShowListUser(false)} />
      )}
    </>
  );
};

export default PostDetail;

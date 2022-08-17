import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showModalMessage } from '../../redux/message/message.slice';
import './CreatePost.css';
import { HOST_URL, PREVLINK } from '../../ultils/constants';
const CreatePost = (props) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [pictures, setPictures] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [error, setError] = useState(false);
  const infoUser = useSelector((state) => state.auth.user.data.data);

  const handleImageChange = (e) => {
    setError(false);
    const selected = e.target.files[0];
    setPictures(selected);
    let reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleTitleChange = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log({ title, pictures });
    const formData = new FormData();
    formData.append('title', title);
    formData.append('pictures', pictures);
    if (pictures === '') {
      setError(true);
    } else {
      axios({
        method: 'post',
        url: `${HOST_URL}/api/post/create-post`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        data: formData,
      })
        .then((response) => {
          // console.log(response);
          if (response.status === 201) {
            props.handleClose();
            dispatch(
              showModalMessage({
                type: 'SUCCESS',
                msg: 'Tạo bài viết thành công!',
              }),
            );
          } else {
            dispatch(
              showModalMessage({
                type: 'ERROR',
                msg: 'Tạo bài viết thất bại',
              }),
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <div className="userPost">
        <Avatar src={`${PREVLINK}/${infoUser.avatar}`} style={{ marginRight: '10px' }} />
        <div style={{ fontWeight: '600' }}>{infoUser.userName}</div>
      </div>

      <textarea
        placeholder="Nói gì về bài viết này"
        type="text"
        name="title"
        id="title"
        value={title}
        onChange={handleTitleChange}
      >
        {title}
      </textarea>
      {error && <p style={{ color: 'red' }}>File is null</p>}
      <div
        className="imgPreview"
        style={{
          background: imgPreview ? `url("${imgPreview}") no-repeat center/cover` : '#fff',
        }}
      >
        {!imgPreview && (
          <>
            <label htmlFor="fileUpload" className="customFileUpload">
              Chọn ảnh từ máy
            </label>
            <input type="file" name="picture" id="fileUpload" accept=".jpg, .jpeg, .png" onChange={handleImageChange} />
          </>
        )}
      </div>
      <button type="submit" className="button__create__post">
        Tạo bài viết
      </button>
    </form>
  );
};

export default CreatePost;

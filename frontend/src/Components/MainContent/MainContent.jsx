import React, { useEffect, useState } from 'react';
import './MainContent.css';
import Grid from '@material-ui/core/Grid';
// import uploadImage from '../../images/upload.png'
import PostItem from '../PostItem/PostItem';
import InfoSection from '../InfoSuggestion/InfoSection';
import Suggestion from '../Suggestions/Suggestion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { HOST_URL, PREVLINK } from '../../ultils/constants';

const MainContent = () => {
  const [listPost, setListPost] = useState([]);
  const infoUser = useSelector((state) => state.auth?.user?.data?.data);
  const prevLink = PREVLINK;

  useEffect(() => {
    // window.location.reload();
    const fetchData = async () => {
      axios({
        method: 'get',
        url: `${HOST_URL}/api/post/get-posts`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }).then((response) => {
        // console.log(response);
        if (response.status === 200) {
          setListPost(response.data.data);
        }
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(listPost);

  return (
    <div>
      <Grid container>
        <Grid item xs={3}></Grid>
        <Grid item xs={5} className="maincontent__container" style={{ marginTop: '50px' }}>
          <div>
            <div style={{ marginTop: '30px' }}>
              {listPost && listPost.length > 0 ? (
                listPost.map((item, index) => (
                  <PostItem
                    id={item._id}
                    userId={item.postBy?._id}
                    userName={item.postBy?.userName}
                    avatar={item.postBy?.avatar}
                    postImage={prevLink + item.pictures[0].img}
                    likes={item.likes.length}
                    title={item.title}
                    liked={item.likes.find((i) => i.userId === infoUser._id) ? true : false}
                    comments={item.comments}
                  />
                ))
              ) : (
                <div style={{ fontWeight: '600' }}>Không có bài viết nào ở đây</div>
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={3} style={{ marginTop: '50px' }}>
          <div style={{ position: 'fixed', width: '100%' }}>
            <InfoSection className="maincontent__right" />
            <Suggestion className="maincontent__right" />
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
};

export default MainContent;

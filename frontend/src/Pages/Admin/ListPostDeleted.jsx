import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { HOST_URL, PREVLINK } from '../../ultils/constants';
import axios from 'axios';
import { Avatar, Button, Input } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { blockApi, unBlockApi } from '../../redux/user/user.slice';
import { Link, useHistory } from 'react-router-dom';
import { deletePostApi } from '../../redux/post/post.slice';
import { showModalMessage } from '../../redux/message/message.slice';
const columns = [
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'postedBy', label: 'Posted By', align: 'center' },
  { id: 'title', label: 'Title', align: 'center' },
  {
    id: 'image',
    label: 'Image',
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
  },
];

function createData(post) {
  return {
    id: post._id,
    postedBy: post.postBy?.userName,
    title: post.title,
    image: post.pictures[0].img,
    likes: post.likes.length,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  textTitle: {
    marginLeft: '10px',
  },
  btnBlock: {
    background: 'blue',
    padding: '10px 20px',
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: '16px',
    fontWeight: '500',
    '&:hover': {
      background: '#e5e5e5',
      color: 'red',
    },
  },

  btnActive: {
    background: 'blue',
    padding: '10px 20px',
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: '16px',
    fontWeight: '500',
    '&:hover': {
      background: '#e5e5e5',
      color: 'green',
    },
  },

  btnDelete: {
    padding: '6px',
    marginRight: '40px',
    marginTop: '10px',
    background: 'blue',
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: '16px',
    fontWeight: '500',
    '&:hover': {
      background: '#e5e5e5',
      color: 'red',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputSearch: {
    marginRight: '40px',
    width: '20%',
  },
});

export default function ListPostDeleted() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [postList, setPostList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const history = useHistory();
  const [inputSearch, setInputSearch] = useState('');

  //   const userBlock = useSelector((state) => state?.user?.blockUser);
  //   const userUnBlock = useSelector((state) => state?.user?.unBlockUser);
  const postDelete = useSelector((state) => state?.post?.postDelete);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure block this post?')) {
      dispatch(deletePostApi(id));
    }
  };

  const handleDeleteCapacity = () => {
    if (postList?.length <= 10) {
      dispatch(
        showModalMessage({
          type: 'ERROR',
          msg: 'Chức năng này chỉ áp dụng khi số lượng các bài viết đã xóa quá 10 bài viết!',
        }),
      );
      return;
    }
    let config = {
      method: 'POST',
      url: `${HOST_URL}/api/post/delete-capacity`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios(config)
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      })
      .catch((err) => {
        window.alert('Lỗi server');
      });
  };

  //   const handleUnBlockUser = (id) => {
  //     if (window.confirm('Are you sure  Un block this account?')) {
  //       dispatch(unBlockApi(id));
  //     }
  //   };

  //   const searchUser = (name) => {
  //     axios({
  //       method: 'get',
  //       url: `${HOST_URL}/api/user/search?name=${name}`,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + localStorage.getItem('token'),
  //       },
  //     }).then((response) => {
  //       // console.log(response);
  //       if (response.status === 200) {
  //         const users = response.data.data.map((user) => createData(user));
  //         setUserList(users);
  //       }
  //     });
  //   };

  //   const handleChangeInput = (e) => {
  //     setInputSearch(e.target.value);
  //     searchUser(e.target.value);
  //   };

  useEffect(
    function () {
      let config = {
        method: 'GET',
        url: `${HOST_URL}/api/post/get-post-deleted`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      axios(config)
        .then((res) => {
          if (res.status === 200) {
            const posts = res.data.data.map((post) => createData(post));
            setPostList(posts);
            if (posts.length > 10) {
              window.alert('Số lượng bài viết đã quá lớn, vui lòng xóa để  tăng dung lượng trống!!!');
            }
            // console.log(users);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [dispatch, postDelete],
  );

  console.log('postList', postList);

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h2 className={classes.textTitle}>List Post</h2>
        <Button
          className={classes.btnDelete}
          onClick={() => {
            handleDeleteCapacity();
          }}
        >
          Delete the capacity
        </Button>
      </div>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {postList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (column.id === 'image') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <img src={`${PREVLINK}/${value}`} style={{ marginRight: '10px', width: '50px' }} />
                        </TableCell>
                      );
                    }
                    if (column.id === 'id') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {/* <Link to={`/post/${value}`} style={{ cursor: 'pointer' }}>
                            {value}
                          </Link>
                           */}
                          <div
                            onClick={() => {
                              history.push({
                                pathname: `/post/${value}`,
                                state: {
                                  postId: value,
                                  liked: false,
                                  numberLikes: row.likes,
                                },
                              });
                            }}
                          >
                            {value}
                          </div>
                        </TableCell>
                      );
                    }
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            className={classes.btnBlock}
                            onClick={() => {
                              handleDelete(row.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={postList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

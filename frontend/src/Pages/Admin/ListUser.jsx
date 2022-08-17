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
import { Link } from 'react-router-dom';
const columns = [
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'avatar', label: 'Avatar', align: 'center' },
  { id: 'fullName', label: 'Full Name', align: 'center' },
  {
    id: 'userName',
    label: 'User Name',
    align: 'center',
  },
  {
    id: 'email',
    label: 'Email',
    align: 'center',
  },
  {
    id: 'followers',
    label: 'Followers',
    align: 'center',
  },
  {
    id: 'following',
    label: 'Following',
    align: 'center',
  },
  {
    id: 'status',
    label: 'Status',
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
  },
];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

function createData(user) {
  return {
    id: user._id,
    avatar: user.avatar,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    followers: user.followers?.length,
    following: user.following?.length,
    status: user.status === 0 ? 'Public' : user.status === 1 ? 'Private' : 'Blocked',
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

  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputSearch: {
    marginRight: '40px',
    width: '20%',
  },
});

export default function ListUser() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [userList, setUserList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const [inputSearch, setInputSearch] = useState('');

  const userBlock = useSelector((state) => state?.user?.blockUser);
  const userUnBlock = useSelector((state) => state?.user?.unBlockUser);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockUser = (id) => {
    if (window.confirm('Are you sure block this account?')) {
      dispatch(blockApi(id));
    }
  };

  const handleUnBlockUser = (id) => {
    if (window.confirm('Are you sure  Un block this account?')) {
      dispatch(unBlockApi(id));
    }
  };

  const searchUser = (name) => {
    axios({
      method: 'get',
      url: `${HOST_URL}/api/user/search?name=${name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then((response) => {
      // console.log(response);
      if (response.status === 200) {
        const users = response.data.data.map((user) => createData(user));
        setUserList(users);
      }
    });
  };

  const handleChangeInput = (e) => {
    setInputSearch(e.target.value);
    searchUser(e.target.value);
  };

  useEffect(
    function () {
      let config = {
        method: 'GET',
        url: `${HOST_URL}/api/user/get-all`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      axios(config)
        .then((res) => {
          if (res.status === 200) {
            const users = res.data.data.map((user) => createData(user));
            setUserList(users);
            // console.log(users);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [dispatch, userBlock, userUnBlock],
  );

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h2 className={classes.textTitle}>List user</h2>
        <Input
          placeholder="Search..."
          className={classes.inputSearch}
          value={inputSearch}
          onChange={handleChangeInput}
        />
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
            {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (column.id === 'avatar') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Avatar src={`${PREVLINK}/${value}`} style={{ marginRight: '10px' }} />
                        </TableCell>
                      );
                    }
                    if (column.id === 'id') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Link to={`/profile-friend/${value}`} style={{ cursor: 'pointer' }}>
                            {value}
                          </Link>
                        </TableCell>
                      );
                    }
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {row.status === 'Blocked' ? (
                            <Button
                              className={classes.btnActive}
                              onClick={() => {
                                handleUnBlockUser(row.id);
                              }}
                            >
                              {' '}
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              className={classes.btnBlock}
                              onClick={() => {
                                handleBlockUser(row.id);
                              }}
                            >
                              Block
                            </Button>
                          )}
                        </TableCell>
                      );
                    }
                    if (column.id === 'status') {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ color: value === 'Blocked' ? 'red' : 'green' }}
                        >
                          {value}
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
        count={userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

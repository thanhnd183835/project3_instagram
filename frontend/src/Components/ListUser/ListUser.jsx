import React, { useState } from 'react';
import './ListUser.css';
import Popup from '../../Components/Popup/Popup';
import Avatar from '@material-ui/core/Avatar';
import { PREVLINK } from '../../ultils/constants';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

const ListUser = (props) => {
  const history = useHistory();
  const infoUser = useSelector((state) => state.auth.user.data.data);
  const [searchValue, setSearchValue] = useState('');
  const { data, isSearch } = props;
  const [listUser, setListUser] = useState(data);

  
  

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setListUser(
      data?.filter((ele) => ele.userName?.includes(e.target.value) || ele.fullName?.includes(e.target.value)),
    );
  };

  return (
    <>
      <Popup
        isOpen={true}
        handleClose={() => {
          props.handleClose();
        }}
        title={props.title}
        isIconClose={true}
        minWidth="400px"
        height="400px"
        isScroll={true}
      >
        {isSearch && (
          <div className="listUser_search_container">
            <strong>Tới: </strong>
            <input className="listUser_input" placeholder="Tìm kiếm..." 
                   value={searchValue} onChange={handleSearch} 
            />
            <hr className="popup_report_hr" />
          </div>
        )}
        {(listUser &&
          listUser.length > 0) ?
          listUser.map((item) => (
            <div style={{ padding: '20px', cursor: 'pointer' }} className="pop_left">
              {item?.userId !== undefined ? (
                <div
                  onClick={() => {
                    if (isSearch) {
                      history.push(`/inbox/${item._id}`);
                    } else if (item?.userId?._id === infoUser?._id) {
                      history.push(`/profile`);
                    } else {
                      history.push(`/profile-friend/${item?.userId._id}`);
                      window.location.reload();
                    }
                  }}
                  style={{ display: 'flex', columnGap: '20px' }}
                >
                  <Avatar style={{ width: '40px' }} 
                          src={`${PREVLINK}/${item.userId?.avatar}`} 
                          alt="element">
                  </Avatar>
                  <div className="pop_name">
                    <div style={{ fontWeight: 'bold' }} className="pop_fullName">
                      {item.userId?.fullName}
                    </div>
                    <div className="pop_userName">{item.userId?.userName}</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', columnGap: '20px' }}>
                  <Avatar style={{ width: '40px' }} 
                  src={`${PREVLINK}/${item.avatar}`} 
                  alt="element">
                  </Avatar>
                  <div
                    onClick={() => {
                      if (isSearch) {
                        history.push(`/inbox/${item._id}`);
                      } else if (item?.userId?._id === infoUser?._id) {
                        history.push(`/profile`);
                      } else {
                        history.push(`/profile-friend/${item._id}`);
                        window.location.reload();
                      }
                    }}
                    className="pop_name"
                  >
                    <div style={{ fontWeight: 'bold' }} className="pop_fullName">
                      {item.fullName}
                    </div>
                    <div className="pop_userName">{item.userName}</div>
                  </div>
                </div>
              )}
            </div>
          )) :
          <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
               <CircularProgress />
          </div> 
         }
        {listUser && listUser.length === 0 && (
          <div
            style={{
              height: '100%',
              fontSize: '20px',
              fontWeight: 'bold',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Không có người dùng
          </div>
        )}
      </Popup>
    </>
  );
};

export default ListUser;

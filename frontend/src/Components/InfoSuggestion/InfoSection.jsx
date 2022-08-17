import React from 'react';
import './InfoSection.css';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { PREVLINK } from '../../ultils/constants';
import { useHistory } from 'react-router';

const InfoSection = () => {
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const history = useHistory();
  return (
    <div>
      <div className="info__container">
        <Avatar src={`${PREVLINK}/${infoUser?.avatar}`} className="info__image" />
        <div className="info_content">
          <a style={{ color: 'black', textDecoration: 'none' }} href="/profile">
            <div className="info_username">{infoUser?.userName}</div>
          </a>
          <div className="info_description">{infoUser?.fullName}</div>
        </div>
        <div
          className="button__switch__account"
          onClick={() => {
            history.push('/login');
          }}
        >
          Chuyển
        </div>
      </div>
    </div>
  );
};

export default InfoSection;

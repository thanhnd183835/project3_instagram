const express = require('express');
const router = express.Router();
const controller = require('../controller/user');
const { requireSignIn, isAdmin } = require('../middleware');

const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, ''));
  },
});
const upload = multer({ storage });

router.post('/follow/:id', requireSignIn, controller.follow);

router.post('/un-follow/:id', requireSignIn, controller.unFollow);

router.post('/accept-follow/:id', requireSignIn, controller.acceptFollow);

router.post('/remove-request/:id', requireSignIn, controller.removeRequest);

router.get('/get-user-suggest', requireSignIn, controller.getListUserSuggestion);

router.get('/get-all-suggest', requireSignIn, controller.allUserSuggest);

router.get('/search', requireSignIn, controller.searchUser);

router.get('/get-all-follower', requireSignIn, controller.getAllUserFollower);

router.get('/get-all-following', requireSignIn, controller.getAllUserFollowing);

router.get('/get-all', requireSignIn, isAdmin, controller.getAllUser);

router.post('/block/:id', requireSignIn, isAdmin, controller.BlockUser);

router.post('/un-block/:id', requireSignIn, isAdmin, controller.UnBlockUser);

router.post('/change-avatar', requireSignIn, upload.array('pictures'), controller.changeAvatar);

router.get('/get-me', requireSignIn, controller.getMe);

router.get('/profile-friend/:id', requireSignIn, controller.getProfileFriend);

router.post('/edit-profile', requireSignIn, controller.editProfile);

router.post('/logout', requireSignIn, controller.logout);


module.exports = router;

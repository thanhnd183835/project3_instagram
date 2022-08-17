const express = require('express');
const router = express.Router();
const controller = require('../controller/post');
const { requireSignIn } = require('../middleware');

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

router.post('/create-post', requireSignIn, upload.array('pictures'), controller.createPost);

router.get('/get-posts', requireSignIn, controller.getPosts);

router.get('/get-post/:id', requireSignIn, controller.getPostById);

router.post('/remove-post/:id', requireSignIn, controller.removePost);

router.post('/like/:postId', requireSignIn, controller.likePost);

router.post('/comment/:postId', requireSignIn, controller.addComment);

router.post('/remove-comment', requireSignIn, controller.removeComment);

router.get('/get-post-for-me', requireSignIn, controller.getPostForMe);
router.get('/get-post-for-friend/:id', requireSignIn, controller.getPostForFriend);
router.get('/get-users-liked/:id', requireSignIn, controller.getListUserLiked);
router.get('/get-post-deleted', requireSignIn, controller.getPostDeleted);

router.post('/delete-post/:id', requireSignIn, controller.deletePost);

router.post('/delete-capacity', requireSignIn, controller.deleteCapacity);

module.exports = router;

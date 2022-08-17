const Post = require('../models/post.js');
const User = require('../models/user.js');
const Notification = require('../models/notification.js');

// add notification to db when user like picture
module.exports.likeNotification = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userLiked = await User.findOne({ _id: req.user._id });
    if (!userLiked) {
      return res.status(404).json({ status: 'User Not Found' });
    }
    const nameUserLiked = userLiked.userName;
    const post = await Post.findOne({ _id: idPost });
    if (!post) {
      return res.status(404).json({ status: 'Post Not Found' });
    }
    const owner = post.postBy;

    const notification = new Notification({
      otherUser: req.user._id,
      userId: owner,
      content: `đã thích bài viết của bạn`,
      post: post._id,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: owner },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

// add notification when user comment to post of friend
module.exports.commentNotification = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userCommented = await User.findOne({ _id: req.user._id });
    if (!userCommented) {
      return res.status(404).json({ status: 'User Not Found' });
    }
    const nameUserCommented = userCommented.userName;
    const post = await Post.findOne({ _id: idPost });
    if (!post) {
      return res.status(404).json({ status: 'Post Not Found' });
    }
    const owner = post.postBy;

    const notification = new Notification({
      otherUser: req.user._id,
      userId: owner,
      content: `đã bình luận bài viết của bạn`,
      post: post._id,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: owner },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// add data notification when user follow other user
module.exports.followNotification = async (req, res) => {
  try {
    const idUserFollowed = req.params.idUser;
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const notification = new Notification({
      otherUser: req.user._id,
      userId: idUserFollowed,
      content: `đã theo dõi bạn`,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: idUserFollowed },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({ code: 0, data: notification });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// get notification by user_id.
module.exports.getNotifications = async (req, res) => {
  try {
    const currentId = req.user._id;
    const listNotification = await Notification.find({ userId: currentId })
      .populate({
        path: 'post',
        select: ['pictures', ['likes'], 'status'],
      })
      .populate({
        path: 'userReport',
      })
      .populate({ path: 'otherUser', select: ['userName', 'avatar'] })
      .sort({ createdAt: -1 });

    if (listNotification) {
      return res.status(200).json({ code: 0, data: listNotification });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// mark notification is read
module.exports.readNotification = async (req, res) => {
  try {
    const currentId = req.user._id;
    const updateStatus = await Notification.updateMany({ userId: currentId, status: 0 }, { status: 1 });
    if (updateStatus) {
      return res.status(200).json({ code: 0, data: updateStatus });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// add notification when user report the post of other user.
module.exports.reportPost = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userReported = await User.findOne({ _id: req.user._id });
    if (!userReported) {
      return res.status(404).json({ status: 'User Not Found' });
    }
    // const nameUserLiked = userLiked.userName;
    const post = await Post.findOne({ _id: idPost, status: 0 });
    if (!post) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    const owner = await User.findOne({ role: 1 });
    // console.log(owner);

    const notification = new Notification({
      otherUser: req.user._id,
      userId: owner._id,
      content: `đã báo cáo một bài viết vì lí do ${req.body.content}`,
      post: post._id,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: owner._id },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

// add notification when user report other user
module.exports.reportUser = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const userReported = await User.findOne({ _id: req.user._id });
    if (!userReported) {
      return res.status(404).json({ status: 'User Not Found' });
    }
    // const nameUserLiked = userLiked.userName;
    const user = await User.findOne({ _id: idUser, status: { $ne: 2 } });
    if (!user) {
      return res.status(404).json({ status: 'User Report Not Found' });
    }
    const owner = await User.findOne({ role: 1 });
    // console.log(owner);

    const notification = new Notification({
      otherUser: req.user._id,
      userId: owner._id,
      content: `đã báo cáo một tài khoản vì lí do ${req.body.content}`,
      userReport: user._id,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: owner._id },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

module.exports.acceptFollowNotification = async (req, res) => {
  try {
    const idUserAccepted = req.params.idUser;
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const notification = new Notification({
      otherUser: req.user._id,
      userId: idUserAccepted,
      content: `đã chấp nhận yêu cầu theo dõi của bạn`,
      status: 0,
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: idUserAccepted },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({ code: 0, data: notification });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

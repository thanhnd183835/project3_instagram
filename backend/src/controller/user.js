const User = require('../models/user.js');

// follow user
const mongoose = require('mongoose');
module.exports.follow = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: req.params.id, status: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }
    const checkExistUser = await User.findOne({ _id: req.user._id, 'following.userId': idFriend });
    if (checkExistUser) {
      return res.status(404).json({ code: 0, message: 'User already followed' });
    }

    if (checkUserBlock.status === 1) {
      const condition = { _id: idFriend };
      const update = {
        // update danh sách followers của người được follow
        $push: {
          requests: req.user._id,
        },
      };

      const res = await User.findOneAndUpdate(condition, update);

      if (res) {
        return res.status(201).json({ code: 0, message: 'request follow successfully' });
      }
    } else {
      const condition1 = { _id: req.user._id };
      const update1 = {
        // update danh sách following của người đi follow
        $push: {
          following: {
            userId: idFriend,
          },
        },
      };
      const condition2 = { _id: idFriend };
      const update2 = {
        // update danh sách followers của người được follow
        $push: {
          followers: {
            userId: req.user._id,
          },
        },
      };
      const res1 = await User.findOneAndUpdate(condition1, update1);
      const res2 = await User.findOneAndUpdate(condition2, update2);

      const result = await User.findOne(condition1);

      if (res1 && res2) {
        return res.status(200).json({ code: 0, message: 'follow success', data: result.following });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// unfollow
module.exports.unFollow = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: idFriend, status: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }
    const currentId = req.user._id;
    const condition1 = {
      _id: currentId,
    };
    const update1 = {
      $pull: {
        following: {
          userId: idFriend,
        },
      },
    };
    const condition2 = {
      _id: idFriend,
    };
    const update2 = {
      $pull: {
        followers: {
          userId: currentId,
        },
      },
    };
    const res1 = await User.findOneAndUpdate(condition1, update1);
    const res2 = await User.findOneAndUpdate(condition2, update2);

    const result = await User.findOne(condition1);

    if (res1 && res2) {
      return res.status(200).json({
        code: 0,
        message: 'unfollow success',
        data: result.following,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// get list user id suggested
module.exports.getListUserSuggestion = async (req, res) => {
  try {
    const currentId = req.user._id;
    let listFollowing = [];
    let list = [];
    let result = [];
    const mySet = new Set();
    const currentUser = await User.findOne({ _id: currentId });
    if (currentUser) {
      listFollowing = currentUser.following;
    }
    if (listFollowing.length > 0) {
      list = listFollowing.map((item) => item.userId.toString());
      for (let i = 0; i < listFollowing.length; i++) {
        const user = await User.findOne({ _id: listFollowing[i].userId });
        if (user) {
          user.following.forEach((item) => {
            if (item.userId.toString() !== currentId && list.includes(item.userId.toString()) === false)
              mySet.add(item.userId._id.toString());
          });
        }
      }
      result = await User.find({ _id: { $in: Array.from(mySet) }, status: 0, role: 0 });
    } else {
      result = await User.find({ _id: { $ne: currentId }, status: 0, role: 0 });
    }
    return res.status(200).json({ code: 0, data: result.sort(() => Math.random() - Math.random()).slice(0, 5) });
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

module.exports.allUserSuggest = async (req, res) => {
  try {
    const currentId = req.user._id;
    let listFollowing = [];
    let result = [];
    const currentUser = await User.findOne({ _id: currentId });
    if (currentUser) {
      listFollowing = currentUser.following;
    }
    if (listFollowing.length > 0) {
      const list = listFollowing.map((item) => {
        return item.userId;
      });
      list.push(req.user._id);

      result = await await User.find({ _id: { $nin: list }, status: { $ne: 2 }, role: 0 });
    } else {
      result = await User.find({ _id: { $ne: currentId }, status: { $ne: 2 }, role: 0 });
    }

    const resultFinal = result.filter(
      (ele) =>
        ele.requests.some((item) => {
          return item.equals(currentId);
        }) === false,
    );
    return res.status(200).json({
      code: 0,
      data: resultFinal,
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: 'Server error' });
  }
};
// search user by name
module.exports.searchUser = async (req, res) => {
  try {
    const name = req.query.name;
    if (req.query.name === '') {
      const users = await User.find({});
      return res.status(200).json({
        code: 0,
        data: users,
      });
    }
    const users = await User.find({
      $or: [
        {
          fullName: {
            $regex: name,
            $options: 'i',
          },
        },
        {
          userName: {
            $regex: name,
            $options: 'i',
          },
        },
      ],
    });
    if (!users) {
      return res.status(404).json({
        code: 0,
        message: 'user not found',
      });
    }
    if (users) {
      return res.status(200).json({
        code: 0,
        data: users,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

// get all followers
module.exports.getAllUserFollower = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    let result = [];
    let listFollower = [];
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    } else {
      listFollower = user.followers;
      for (let i = 0; i < listFollower.length; i++) {
        const userFollowedMe = await User.findOne({ _id: listFollower[i].userId, status: { $ne: 2 } });
        if (userFollowedMe) result.push(userFollowedMe);
      }
    }
    return res.status(200).json({ code: 0, data: result });
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

// get all following
module.exports.getAllUserFollowing = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    let result = [];
    let listFollowing = [];
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    } else {
      listFollowing = user.following;
      for (let i = 0; i < listFollowing.length; i++) {
        const userFollowedMe = await User.findOne({ _id: listFollowing[i].userId, status: { $ne: 2 } });
        if (userFollowedMe) result.push(userFollowedMe);
      }
    }
    return res.status(200).json({ code: 0, data: result });
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: 0 });
    return res.status(200).json({ code: 0, data: users });
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

// block user
module.exports.BlockUser = async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: req.params.id }, { status: 2 });
    if (userUpdate) {
      return res.status(200).json({ code: 0, message: 'Block successfully' });
    } else {
      return res.status(400).json({ code: 0, message: 'Block failed' });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};

// unblock
module.exports.UnBlockUser = async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: req.params.id }, { status: 0 });
    if (userUpdate) {
      return res.status(200).json({ code: 0, message: 'Un Block successfully' });
    } else {
      return res.status(400).json({ code: 0, message: ' Un Block failed' });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// change avatar
module.exports.changeAvatar = async (req, res) => {
  try {
    let pictures = [];

    if (req.files.length > 0) {
      pictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }
    console.log(pictures);

    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }

    const updateAvatar = await User.findOneAndUpdate({ _id: user._id }, { avatar: pictures[0].img });
    if (updateAvatar) {
      return res.status(200).json({ code: 0, data: 'update successfully' });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

// get all info my profile
module.exports.getMe = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) return res.status(404).json({ code: 1, error: 'Can not find user' });
    return res.status(200).json({ code: 0, data: user });
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

// get profile of friend
module.exports.getProfileFriend = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const exFriend = await User.findOne({ _id: idFriend });
    if (exFriend.status === null) {
      return res.status(500).json({ code: 1, error: 'Status is null' });
    }
    const friend = await User.findOne({ _id: idFriend })
      .populate({
        path: 'followers',
        populate: { path: 'userId', select: ['fullName', 'userName', 'avatar', 'status'] },
      })
      .populate({
        path: 'following',
        populate: { path: 'userId', select: ['fullName', 'userName', 'avatar', 'status'] },
      });
    friend.following = friend.following.filter((ele) => ele.userId.status === 0);
    friend.followers = friend.followers.filter((ele) => ele.userId.status === 0);

    if (!friend) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    return res.status(200).json({ code: 0, data: friend });
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

// edit my profile
module.exports.editProfile = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }

    const checkExistsEmail = await User.findOne({ email: req.body.email });
    const checkExistsUserName = await User.findOne({ userName: req.body.userName });
    if (
      (checkExistsEmail && checkExistsEmail.id !== currentId) ||
      (checkExistsUserName && checkExistsUserName.id !== currentId)
    ) {
      return res.status(404).json({ code: 2, error: 'User already exists' });
    }
    const update = {
      fullName: req.body.fullName,
      userName: req.body.userName,
      email: req.body.email,
      status: req.body.status,
    };
    const updateUser = await User.findOneAndUpdate({ _id: user._id }, update);
    if (updateUser) {
      const userUpdated = await User.findOne({ _id: currentId });
      return res.status(200).json({ code: 0, data: userUpdated });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

// logout
module.exports.logout = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    const logout = await User.findOneAndUpdate({ _id: currentId }, { active: false });
    console.log(logout.userName);
    if (logout) {
      const userLogout = await User.findOne({ _id: currentId });
      return res.status(200).json({ code: 0, data: userLogout });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

module.exports.acceptFollow = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: req.params.id, status: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }

    const checkExistUser = await User.findOne({ _id: req.user._id, 'followers.userId': idFriend });
    if (checkExistUser) {
      return res.status(404).json({ code: 1, message: 'User already in list followers' });
    }

    const checkInListRequest = await User.findOne({ _id: req.user._id, requests: idFriend });
    if (!checkInListRequest) {
      return res.status(404).json({ code: 1, message: 'Not found Request!' });
    }

    const condition1 = { _id: req.user._id };
    const update1 = {
      $push: {
        followers: {
          userId: idFriend,
        },
      },
      $pull: {
        requests: idFriend,
      },
    };

    const condition2 = { _id: idFriend };
    const update2 = {
      // update danh sách following của người đi follow
      $push: {
        following: {
          userId: req.user._id,
        },
      },
    };

    const res1 = await User.findOneAndUpdate(condition1, update1);
    const res2 = await User.findOneAndUpdate(condition2, update2);

    if (res1 && res2) {
      return res.status(200).json({ code: 0, message: 'accept follow success', data: res1.followers });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports.removeRequest = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: idFriend, status: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }

    const checkHaveRequest = checkUserBlock.requests.map((ele) => ele.toString()).find((id) => req.user._id === id);
    if (!checkHaveRequest) {
      return res.status(404).json({ code: 1, message: 'Not found Request!' });
    }
    const currentId = req.user._id;
    const condition = {
      _id: idFriend,
    };
    const update = {
      $pull: {
        requests: currentId,
      },
    };
    const result = await User.findOneAndUpdate(condition, update);

    if (result) {
      return res.status(200).json({
        code: 0,
        message: 'remove Request success!',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

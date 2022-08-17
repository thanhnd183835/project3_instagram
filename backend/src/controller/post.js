const Post = require('../models/post.js');
const User = require('../models/user.js');
const Notification = require('../models/notification.js');

// create new post
module.exports.createPost = (req, res) => {
  try {
    const { title } = req.body;
    let pictures = [];
    if (req.files.length > 0) {
      pictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }

    const post = new Post({
      title: title,
      pictures: pictures,
      postBy: req.user._id,
    });
    post.save(async (error, post) => {
      if (error) return res.status(400).json({ error: 'error when user create post' });
      if (post) {
        await User.findOneAndUpdate({ _id: req.user._id }, { $push: { posts: { postId: post._id } } });
        res.status(201).json({
          code: 0,
          data: post,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// get post by id_post
module.exports.getPostById = async (req, res) => {
  const idPost = req.params.id;
  if (idPost) {
    Post.findById({ _id: idPost })
      .populate('postBy', ['userName', 'avatar'])
      .populate({ path: 'comments', populate: { path: 'userId', select: ['userName', 'avatar'] } })
      .sort('-updateAt')
      .then((post) => {
        res.status(200).json({
          code: 0,
          data: post,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
      });
  }
};

// get all post of user.
module.exports.getPosts = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate({
    path: 'following',
    populate: { path: 'userId', select: ['_id', 'status'] },
  });

  // console.log("user", user.following);

  if (user) {
    const listFollowing = user.following
      .filter((obj) => {
        return obj.userId && obj.userId.status !== 2;
      })
      .map((obj) => obj.userId._id);
    Post.find({ postBy: { $in: listFollowing }, status: 0 })
      .populate('postBy', ['userName', 'avatar', 'status'])
      .populate({ path: 'comments', populate: { path: 'userId', select: 'userName' } })
      // .where('postBy.status').ne(2)
      .sort('-updatedAt')
      .then((posts) => {
        // console.log(posts);
        res.status(200).json({
          code: 0,
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
      });
  }
};

// remove post by id
module.exports.removePost = async (req, res) => {
  try {
    const idPost = req.params.id;
    const removePost = await Post.findOneAndUpdate({ _id: idPost, status: 0 }, { status: 1 });
    if (!removePost) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    if (removePost) {
      return res.status(200).json({
        code: 0,
        message: 'Delete post success',
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// like post
module.exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const checkPostExist = await Post.findOne({ _id: postId, status: 0 });
    if (!checkPostExist) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    const userLike = req.user._id;
    const checkInList = await Post.findOne({ _id: postId, 'likes.userId': userLike });
    const update = checkInList
      ? {
          $pull: {
            likes: {
              userId: userLike,
            },
          },
        }
      : {
          $push: {
            likes: {
              userId: userLike,
            },
          },
        };
    const postUpdate = await Post.findOneAndUpdate({ _id: postId }, update);
    // console.log(postUpdate);
    if (postUpdate) {
      return res.status(200).json({ code: 0, message: 'react post successfully' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// comment post
module.exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    // const post = await Post.findOne({ _id: postId });
    const update = {
      $push: {
        comments: {
          userId: req.body.userId,
          content: req.body.content,
        },
      },
    };
    const postUpdate = await Post.findOneAndUpdate({ _id: postId, status: 0 }, update);
    if (!postUpdate) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    if (postUpdate) {
      return res.status(200).json({ code: 0, message: 'add comment successfully' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// remove comment of post
module.exports.removeComment = async (req, res) => {
  try {
    const update = {
      $pull: {
        comments: {
          _id: req.body.commentId,
        },
      },
    };
    const postUpdate = await Post.findByIdAndUpdate({ _id: req.body.postId, status: 0 }, update);
    if (!postUpdate) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    if (postUpdate) {
      return res.status(200).json({ code: 0, message: 'remove comment successfully' });
    }
    return res.status(400).json({ code: 1, message: 'post not found' });
  } catch (err) {
    console.log(err);
  }
};

// get all post by me
module.exports.getPostForMe = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ message: 'User not find' });
    }
    const posts = await Post.find({ postBy: currentId, status: 0 });
    if (!posts) {
      return res.status(404).json({ message: 'Not find post ' });
    }
    return res.status(200).json({ code: 0, data: posts });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// gte all post of friend
module.exports.getPostForFriend = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const user = await User.findOne({ _id: idFriend });
    if (!user) {
      return res.status(404).json({ message: 'User not find' });
    }
    const posts = await Post.find({ postBy: idFriend, status: 0 });
    if (!posts) {
      return res.status(404).json({ message: 'Not find post ' });
    }
    return res.status(200).json({ code: 0, data: posts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// get list user id liked
module.exports.getListUserLiked = async (req, res) => {
  try {
    const idPost = req.params.id;
    const listUserLiked = await Post.findOne({ _id: idPost }).populate({
      path: 'likes',
      populate: { path: 'userId', select: ['avatar', 'userName', 'fullName', '_id'] },
    });
    if (!listUserLiked) {
      return res.status(404).json({ code: 1, message: 'Post not found' });
    }
    return res.status(200).json({ code: 0, data: listUserLiked });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


module.exports.getPostDeleted = async (req, res) => {
  Post.find({ status: 1 })
    .populate('postBy', ['userName', 'avatar', 'status'])
    // .populate({ path: 'comments', populate: { path: 'userId', select: 'userName' } })
    // .where('postBy.status').ne(2)
    .sort('-updatedAt')
    .then((posts) => {
      // console.log(posts);
      res.status(200).json({
        code: 0,
        data: posts,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    });
};


module.exports.deletePost = async (req, res) => {
  try {
    const idPost = req.params.id;

    Notification.deleteMany({ post: idPost }).then(function(){
      console.log("Notification deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });

    const userUpdate = await User.findOneAndUpdate({'posts.postId': idPost}, { $pull: {posts: {postId: idPost}}});

    if(!userUpdate) {
      return res.status(404).json({ code: 0, message: 'User Not Found!' });
    }
    const deletePost = await Post.findOneAndRemove({ _id: idPost });
    if (!deletePost) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    if (deletePost) {
      return res.status(200).json({
        code: 0,
        message: 'Delete Forever post success',
      });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};


module.exports.deleteCapacity = async (req, res) => {
  try {

    let listPost = await Post.find({status: 1});
    if(listPost.length > 10) {
      listPost = listPost.slice(0,10);
    }

    listPost.map(async (post) => {
      const idPost = post._id;

      Notification.deleteMany({ post: idPost }).then(function(){
        console.log("Notification deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
  
      const userUpdate = await User.findOneAndUpdate({'posts.postId': idPost}, { $pull: {posts: {postId: idPost}}});
  
      if(!userUpdate) {
        return res.status(404).json({ code: 0, message: 'User Not Found!' });
      }
      const deletePost = await Post.findOneAndRemove({ _id: idPost });
      if (!deletePost) {
        return res.status(404).json({ code: 0, message: 'Post Not Found!' });
      }
    })
    
    return res.status(200).json({
      code: 0,
      message: 'Delete Capacity post success',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
    followers: [{ userId: { type: ObjectId, ref: 'User' } }],
    following: [{ userId: { type: ObjectId, ref: 'User' } }],
    requests: [{type: ObjectId, ref: 'User'}],
    notifications: [{ notificationId: { type: ObjectId, ref: 'Notification' } }],
    posts: [{ postId: { type: ObjectId, ref: 'Post' } }],
    role: {
      type: Number,
      default: 0,
      required: true,
      // 0: user, 1: admin,
    },
    status: {
      type: Number,
      default: 0,
      enum: [
        0, // public
        1, //private
        2, //blocked
      ],
    },
    active: {
      type: Boolean,
      default: false,
    },
    createAt: Date,
  },
  { timestamps: true },
);

var User = mongoose.model('User', userSchema, 'User');
module.exports = User;

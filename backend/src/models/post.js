const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    likes: [
      {
        userId: { type: ObjectId, ref: 'User' },
      },
    ],
    comments: [
      {
        userId: { type: ObjectId, ref: 'User' },
        content: { type: String },
        // commentBy: {type: String}
      },
    ],
    postBy: { type: ObjectId, ref: 'User' },
    status: {
      type: Number,
      default: 0,
      // 0: default
      // 1: deleted
    },
    pictures: [
      {
        img: {
          type: String,
          required: true,
        },
      },
    ],
    // createAt: Date,
    // updateAt: Date,
  },
  { timestamps: true },
);

var Post = mongoose.model('Post', userSchema, 'Post');
module.exports = Post;

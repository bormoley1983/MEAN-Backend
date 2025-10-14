const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const CheckAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post(
  '',
  CheckAuth,
  multer({ storage: storage }).single('image'),
  (req, resp, next) => {
    if (!req.userData || !req.userData.userId) {
      return resp
        .status(401)
        .json({ message: 'Authentication failed on UserId' });
    }
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId,
    });
    post
      .save()
      .then((savedPost) => {
        resp.status(201).json({
          message: 'Post added successfully',
          post: {
            ...savedPost,
            id: savedPost._id,
          },
        });
      })
      .catch((err) => {
        resp.status(500).json({
          message: 'Saving post failed',
          error: err,
        });
      });
  }
);

router.put(
  '/:id',
  CheckAuth,
  multer({ storage: storage }).single('image'),
  (req, resp, next) => {
    let imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId,
      }
    )
      .then((savedPost) => {
        if (savedPost.modifiedCount > 0) {
          resp.status(200).json({
            message: 'Post updated successfully',
            postId: savedPost._id,
          });
        } else {
          resp.status(401).json({
            message: 'Unauthorized!',
          });
        }
      })
      .catch((err) => {
        console.error('Update error:', err);
        resp.status(500).json({
          message: 'Post update failed',
          error: err,
        });
      });
  }
);

router.get('', (req, resp, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = Number(req.query.currentPage);
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize) {
    if (currentPage > 0) {
      postQuery.skip(pageSize * (currentPage - 1));
    }
    postQuery.limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      resp.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        totalPostsCount: count,
      });
    })
    .catch((err) => {
      resp.status(500).json({
        message: 'Fetching posts failed',
        error: err,
      });
    });
});

router.get('/:id', (req, resp, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        resp.status(200).json({
          message: 'Post fetched successfully',
          post: post,
        });
      } else {
        resp.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch((err) => {
      resp.status(500).json({
        message: 'Fetching post failed',
        error: err,
      });
    });
});

router.delete('/:id', CheckAuth, (req, resp, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        resp.status(200).json({ message: 'Post deleted!' });
      } else {
        resp.status(401).json({ message: 'Unauthorized!' });
      }
    })
    .catch((err) => {
      resp.status(500).json({
        message: 'Fetching posts failed',
        error: err,
      });
    });
});

module.exports = router;

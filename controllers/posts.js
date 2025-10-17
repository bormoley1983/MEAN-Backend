const Post = require('../models/post');

exports.getAllPosts = (req, resp, next) => {
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
};

exports.getPostById = (req, resp, next) => {
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
};

exports.createPost = (req, resp, next) => {
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
};

exports.updatePost = (req, resp, next) => {
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
      if (savedPost.n > 0) {
        resp.status(200).json({
          message:
            savedPost.modifiedCount > 0
              ? 'Post updated successfully'
              : 'No updates needed to be done',
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
};

exports.deletePostById = (req, resp, next) => {
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
};

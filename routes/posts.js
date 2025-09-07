const express = require("express")
const Post = require("../models/post")

const router = express.Router();

router.post("", (req, resp, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((savedPost) => {
    console.log(savedPost);
    resp.status(201).json({
      message: "Post added successfully",
      postId: savedPost._id,
    });
  });
});

router.put("/:id", (req, resp, next) => {
  Post.updateOne(
    { _id: req.params.id }, 
    { 
      title: req.body.title,
      content: req.body.content
    })
      .then((savedPost) => {
        console.log(savedPost);
        resp.status(200).json({
          message: "Post updated successfully",
          postId: savedPost._id,
        });
      })
      .catch((err) => {
        console.error('Update error:', err);
        resp.status(500).json({ message: 'Update failed', error: err });
    });
});


router.get("", (req, resp, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    resp.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (req, resp, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
    console.log(post);
    resp.status(200).json({
      message: "Post fetched successfully",
      post: post,
    });
    } else {
      resp.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, resp, next) => {
  console.log("Post to be deleted: " + req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    resp.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
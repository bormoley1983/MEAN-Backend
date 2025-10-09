const express = require("express")
const multer = require("multer");
const Post = require("../models/post")

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {  
      error = null;
    }
    callback(error, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext)
  }
});

router.post("", multer({storage: storage}).single("image"), (req, resp, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then((savedPost) => {
    console.log(savedPost);
    resp.status(201).json({
      message: "Post added successfully",
      post: {
        ...savedPost,
        id: savedPost._id,
      }
      // post: {
      //   id: savedPost._id,
      //   title: savedPost.title,
      //   content: savedPost.content,
      //   imagePath: savedPost.imagePath
      // }
    });
  });
});

router.put("/:id",  multer({storage: storage}).single("image"), (req, resp, next) => {
  let imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  Post.updateOne(
    { _id: req.params.id }, 
    { 
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
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
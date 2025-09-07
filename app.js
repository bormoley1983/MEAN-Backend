const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

mongoose
  .connect("mongodb://localhost:27017/mean_course")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

const app = express();
app.use(bodyParser.json());

app.use((req, resp, next) => {
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  resp.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  next();
});

app.post("/api/posts", (req, resp, next) => {
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

app.get("/api/posts", (req, resp, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    resp.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:id", (req, resp, next) => {
  console.log("Post to be deleted: " + req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    resp.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;

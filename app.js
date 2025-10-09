const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");

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
app.use(bodyParser.urlencoded({ extended: false  }));
app.use("/images", express.static("images")); //express.static(path.join("somepath/images"))

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

app.use("/api/posts", postsRoutes);

module.exports = app;

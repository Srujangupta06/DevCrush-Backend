// importing express from node_modules
const express = require("express");

// creating an instance of express
const app = express();

// listen to incoming request by running web server on port
const port = 8000;

app.get(
  "/",
  (req, res, next) => {
    console.log("Hello World 1");
    next();
  },
  (req, res, next) => {
    console.log("Hello World 2");
    next();
  },
  (req, res, next) => {
    console.log("Hello World 3");
    next();
  },
  (req, res, next) => {
    console.log("Hello World 4");
    next();
  }
);

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

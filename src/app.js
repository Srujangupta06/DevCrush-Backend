// importing express from node_modules
const express = require("express");

// creating an instance of express
const app = express();

// listen to incoming request by running web server on port
const port = 8000;

app.use("/", (req, res) => {
  res.send("Hello from Home Page");
});

app.use("/about", (req, res) => {
    res.send("Hello from About Page");
});
  

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

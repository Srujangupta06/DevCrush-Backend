// importing express from node_modules
const express = require("express");
const adminAuth = require("./middlewares/adminAuth");

// creating an instance of express
const app = express();
app.use("/admin", adminAuth);
// listen to incoming request by running web server on port
const port = 8000;

app.delete("/admin/delete", (req, res) => {
  res.send("User Deleted");
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

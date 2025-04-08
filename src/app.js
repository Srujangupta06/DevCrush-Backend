// importing express from node_modules
const express = require("express");
const { initializeDB } = require("./config/database");
const cookieParser = require("cookie-parser");
// creating an instance of express
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const app = express();
app.use(express.json());
app.use(cookieParser());

// Router 
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

// listen to incoming request by running web server on port
const port = 8000;

initializeDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch(() => console.error("Error connecting to MongoDB"));

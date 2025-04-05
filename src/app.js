// importing express from node_modules
const express = require("express");
const { initializeDB } = require("./config/database");
const User = require("./models/user");
// creating an instance of express
const app = express();

// listen to incoming request by running web server on port
const port = 8000;

// API for User Registration

app.post("/auth/signup", async (req, res) => {
  // Incoming user info
  const user = {
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat@gmail.com",
    password: "Vk@18"
  };

  // Creating a new instance of User Model
  const newUser = new User(user);

  // Inserting document into user Collection
  await newUser.save();
  // Send Response to client
  res.send("Registration Successfull");
});

initializeDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch(() => console.error("Error connecting to MongoDB"));

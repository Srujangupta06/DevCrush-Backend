// importing express from node_modules
const express = require("express");
const { initializeDB } = require("./config/database");
const User = require("./models/user");
// creating an instance of express
const app = express();
app.use(express.json());
// listen to incoming request by running web server on port
const port = 8000;

// API for User Registration

app.post("/auth/signup", async (req, res) => {
  // Incoming user info
  const user = req.body;

  try {
    // Creating a new instance of User Model
    const newUser = new User(user);

    // Inserting document into user Collection
    await newUser.save();
    // Send Response to client
    res.send("Registration Successfull");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// API for retriveing only one User
app.get("/get-user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something Went Wrong");
  }
});

// API for retriveing all Users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("Something Went Wrong");
  }
});

// API for Removing User

app.delete("/remove-user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Something Went Wrong");
  }
});

// API for update the data of user
app.patch("/update-user", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send("User Updated Successfully");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// Update the user by Email id 

initializeDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch(() => console.error("Error connecting to MongoDB"));

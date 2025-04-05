const mongoose = require("mongoose");

// Connect to MongoDB
const initializeDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:namastenode@namastenode.bt9ldmd.mongodb.net/devCrush"
  );
};

module.exports = { initializeDB };
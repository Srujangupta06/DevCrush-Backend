const mongoose = require("mongoose");

// Connect to MongoDB
const initializeDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = { initializeDB };

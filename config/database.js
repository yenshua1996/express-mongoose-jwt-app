const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log(`DB Connected!`);
  } catch (err) {
    console.log("Failed to connect to DB!");
  }
};

module.exports = connectDB;

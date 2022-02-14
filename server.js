const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database");
const JwtUser = require("./model/user");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

//Create express app
const app = express();

// Application middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generateToken = () => {
  return;
};

// Register route
app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { fullname, email, password } = req.body;

    // Validate user input
    if (!fullname || !email || !password) {
      res.status(400);

      throw new Error("All input filed is required!");
    }

    // Validate if the user already exist
    const existingUser = await JwtUser.findOne({ email });

    if (existingUser) {
      res.status(409);

      throw new Error("User is already exist!");
    }

    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a user in our database.
    const user = await JwtUser.create({
      fullname,
      email,
      password: hashPassword,
    });

    // Create a signed JWT token
    const token = jwt.sign(
      { userId: user._id, email, fullname },
      process.env.JWT_KEY,
      {
        expiresIn: "15d",
      }
    );

    res.status(201).json({
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      token: token,
    });
  } catch (err) {
    res.status(404).json({ msg: "Something wen wrong!" });
  }
});

// Register login
app.post("/login", async (req, res) => {
  //Get user credintials
  const { email, password } = req.body;

  //Validate user input credintials
  if (!email || !password) {
    res.status(400).json({ msg: "All input is required!" });
  }

  //Validate if user exist
  const user = await JwtUser.findOne({ email });

  //Compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    // Response
    res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      userId: user._id,
      token: token,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server is up and running!", PORT);
  connectDB();
});

const mongoose = require("mongoose");

const jwtUserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please add firstname!"],
  },
  email: {
    type: String,
    required: [true, "Please add email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add password!"],
  },
});

const JwtUser = mongoose.model("JwtUser", jwtUserSchema);

module.exports = JwtUser;

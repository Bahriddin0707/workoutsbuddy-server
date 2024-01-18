const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static Sign Up Method
userSchema.statics.signup = async function (name, email, password) {
  // validation
  if (!name || !password || !email) {
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "password is not strong enough (the password must contain at least 8 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol)"
    );
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("User already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, email, password: hash });

  return user;
};

// Static Log In Method
userSchema.statics.login = async function (email, password) {
  if (!password || !email) {
    throw new Error("All fields must be filled");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Not Found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

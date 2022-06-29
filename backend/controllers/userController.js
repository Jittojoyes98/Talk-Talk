const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter full details");
  }

  const userExist = await User.findOne({ email });
  // console.log(userExist);
  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  let createUser;
  if (pic === "") {
    createUser = await User.create({
      name,
      email,
      password,
    });
  } else {
    createUser = await User.create({
      name,
      email,
      pic,
      password,
    });
  }
  if (createUser) {
    res.send({
      name,
      email,
      pic: createUser.pic,
      token: generateToken(createUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Cannot create User");
  }
});

const loginAuthentication = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist && userExist.matchPassword(password)) {
    res.json({
      pic: userExist.pic,
      name: userExist.name,
      email,
      token: generateToken(userExist._id),
    });
  } else {
    res.status(400);
    throw new Error("User doesnot exist");
  }
});

// to create a search for users , for that we can use search
// /api/user/?search=jitto
const allUsers = asyncHandler(async (req, res) => {
  const request = req.query.search;
  // console.log(request);
  const result = await User.find({
    $or: [
      { name: { $regex: request, $options: "i" } },
      { email: { $regex: request, $options: "i" } },
    ],
  });
  res.status(200).send(result);
});

module.exports = { registerUser, loginAuthentication, allUsers };

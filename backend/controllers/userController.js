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

  const createUser = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (createUser) {
    res.send({
      name,
      email,
      password,
      pic,
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
      email,
      password,
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

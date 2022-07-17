const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

const singleChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("Userid not specified");
    res.status(400).send("Userid not specified");
  }

  var chatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chatExist = await User.populate(chatExist, {
    path: "latestMessage.sender",
    select: "name email",
  });
  //   console.log(chatExist);

  if (chatExist.length > 0) {
    // console.log("Chat already exist");
    //   chat already exist
    res.status(200).send(chatExist[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const chatCreated = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: chatCreated._id,
      }).populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      console.log("Couldn't create a chat");
      throw new Error(error);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        const value = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.send(value);
      });
    // res.send(result);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  // arrays are send in the form of stringify format , and thus we need to parse them.
  if (!req.body.users || !req.body.name) {
    console.log("Please enter all the details");
    res.status(400).send("Enter all fields");
  }

  var users = JSON.parse(req.body.users);
  users.push(req.user);
  if (users.length <= 2) {
    res.status(400).send("More than 2 users are required for group chat");
  }
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const groupChange = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupChange) {
    res.status(400).send("No valid user");
  } else {
    res.status(200).json(groupChange);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const addUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!addUser) {
    res.status(404).send("Chat does not exist");
  } else {
    res.json(addUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removeUser) {
    res.status(404).send("Chat does not exist");
  } else {
    res.json(removeUser);
  }
});

module.exports = {
  singleChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

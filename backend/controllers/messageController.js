const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Error");
    req.statusCode(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatid,
    })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error("Cannot fetch all messgaes");
  }
});

module.exports = { sendMessage, allMessages };

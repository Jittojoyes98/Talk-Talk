const express = require("express");
const app = express();
const dotenv = require("dotenv");
const chats = require("./data/data");
const connDB = require("./config/data");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { application } = require("express");
const messageRoutes = require("./routes/messageRoutes");
const PORT = process.env.PORT || 5000;
connDB();

const { Server } = require("socket.io");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server has started on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
  });
  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("Joined the room " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", { message: "Typing going on" });
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", { message: "Typing stopped" });
  });
  socket.on("new message", (newMessage) => {
    if (!newMessage.chat.users) {
      return console.log("newMessage.chat.users not defined");
    }
    const chat = newMessage.chat;
    // console.log(newMessage.sender._id);
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });
});

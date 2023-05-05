const express = require("express");
const app = express();
const dotenv = require("dotenv");
const chats = require("./data/data");
const connDB = require("./config/data");
dotenv.config();
const cors = require('cors')
const corsOptions = require("./config/corsOptions");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");
const PORT = process.env.PORT || 5000;
connDB();

const { Server } = require("socket.io");
const path = require("path");

app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization','https://talk-talk-api.onrender.com');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

// -------------------------Deployment--------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// -------------------------Deployment--------------------------------

const server = app.listen(
  PORT,
  console.log(`Server has started on port ${PORT}`)
);

const io = new Server(server, {cors :{
  origin:"https://talk-talk.onrender.com",
  credentials: true,
  optionsSuccessStatus: 200
},pingTimeout:60000});

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
  socket.on("new_message", (newMessage) => {
    if (!newMessage.chat.users) {
      return console.log("newMessage.chat.users not defined");
    }
    const chat = newMessage.chat;
    console.log(newMessage.sender._id);
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) {
        return;
      }
      socket.in(user._id).emit("message_recieved", newMessage);
    });
  });
  socket.off("setup", () => {
    console.log("Disconnected");
    socket.leave(user._id);
  });
});

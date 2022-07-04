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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Server has started on port ${PORT}`));

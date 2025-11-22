const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDb = require("./db");
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRouter");
const messageRouter = require("./Routes/messageRoute");
dotenv.config();
app.use(express.json());

app.use(cors());

app.use("/auth", authRouter);
app.use("/api", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

const server = app.listen(process.env.PORT, async () => {
  console.log(`server started on port ${process.env.PORT}`);
  await ConnectDb();
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData.User_id);
    socket.emit("connected");
  });
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("user joined room: ", roomId);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.Chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((u, i) => {
      if (u._id === newMessageRecieved.Sender._id) return;
      socket.in(u._id).emit("message recieved", newMessageRecieved);
    });
  });
});

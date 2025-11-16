const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDb = require("./db");
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRouter");
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/api", userRouter);
app.use("/chat", chatRouter);

app.listen(process.env.PORT, async () => {
  console.log(`server started on port ${process.env.PORT}`);
  await ConnectDb();
});

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);
app.use(express.json());

//Connect to MongoDB
connectDB();

// Routes
app.use("/api/chat", require("./routes/chatbot"));
app.use("/webhook", require("./routes/webhook"));
// app.use("/api/weather", require("./routes/weather"));
// app.use("/api/chat", require("./routes/chat"));

app.get("/", (req, res) => {
  res.send("WELCOME TO SHADOCK. API!");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});

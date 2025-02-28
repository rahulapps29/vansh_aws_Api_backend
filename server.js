require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const spApiRoutes = require("./routes/spApi");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // ✅ Allow cookies and headers
    methods: ["GET", "POST"], // ✅ Specify allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Specify allowed headers
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/sp-api", spApiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/users", likeRoutes);
app.use("/api/users", postRoutes);
app.use("/api/users", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
